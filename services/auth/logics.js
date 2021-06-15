const crypto = require( "crypto" ),
    argon = require( "argon2" ),
    { accessTokenExpireDateInHours, refreshTokenExpireInHours } = require( "./configs" ).constants,
    { appEndpoint } = require( "../../configs.global" )( process.env ).constants[ process.env.ENV ];

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, redisDbClient, errorUtil, sequelizeCachingUtil, tokenUtil, resourceAuthorizeUtil, { jobManagerUtil }, userService, customerService, providerService, providerAssistantService, userDeviceService, userShareService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.redisDbClient = redisDbClient;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.tokenUtil = tokenUtil;
        this.redisDbClient = redisDbClient;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.jobManagerUtil = jobManagerUtil;
        this.userService = userService;
        this.customerService = customerService;
        this.providerService = providerService;
        this.providerAssistantService = providerAssistantService;
        this.userDeviceService = userDeviceService;
        this.userShareService = userShareService;
    }

    async createRefreshToken( payload ) {
        const expireDate = new Date();
        const refreshToken = crypto.randomBytes( 32 ).toString( "hex" );

        expireDate.setHours( expireDate.getHours() + refreshTokenExpireInHours );
        const value = { ...payload, "expireDate": expireDate };
        const valueStr = JSON.stringify( value );

        await this.redisDbClient.hset( "refresh_tokens", refreshToken, valueStr );
        return refreshToken;
    }

    async createAccessToken( payload, expInHours = accessTokenExpireDateInHours ) {
        return await this.tokenUtil.generateToken( { "payload": payload, "expInHours": expInHours } );
    }

    async checkRefreshToken( refreshToken, _userUUID ) {
        const nowDate = new Date();
        const data = await this.redisDbClient.hget( "refresh_tokens", refreshToken );

        if ( !data ) {
            return this.errorUtil.throwClientError( "دسترسی غیر مجاز", 401 );
        }
        const { userUUID, "expireDate": expireDateStr } = JSON.parse( data );
        const expireDate = new Date( expireDateStr );

        if ( expireDate < nowDate || userUUID !== _userUUID ) {
            return this.errorUtil.throwClientError( "دسترسی غیر مجاز", 401 );
        }
    }

    async createAccessTokenByRefreshToken( userRole, refreshToken, { email = null, phone = null, deviceToken = null } = {} ) {
        let user;
        let userDevice;

        if ( email ) {
            user = await this.userService.getByEmail( email, userRole );
        } else if ( phone ) {
            user = await this.userService.getByPhone( phone, userRole );
        }
        if ( deviceToken ) {
            userDevice = await this.userDeviceService.getById( deviceToken );
        }
        const accessTokenPayload = { "uuid": user.uuid, "role": userRole, "deviceToken": userDevice ? userDevice.deviceToken : null };
       
        await this.checkRefreshToken( refreshToken, user.uuid );
        const accessToken = await this.createAccessToken( accessTokenPayload );

        return { "accessToken": accessToken };
    }
   
    async getPhoneByPhoneConfirmKey( phoneConfirmKey ) {
        const phone = await this.redisDbClient.get( phoneConfirmKey );

        if ( phone ) {
            await this.redisDbClient.del( phoneConfirmKey );
            return phone;
        }
        return this.errorUtil.throwClientError( "شماره تلفن شما اعتبارسنجی نشده است", 400 );
    }

    async loginUserByEmailAndPassword( userRole, user, password, { deviceToken = null } = {} ) {
        if ( user.emailConfirm ) {
            const verifyPasswordResult = await argon.verify( user.password, password );

            if ( verifyPasswordResult ) {
                let userDevice;

                if ( deviceToken ) {
                    userDevice = await this.userDeviceService.getById( deviceToken );

                    if ( userDevice ) {
                        await userDevice.cache().update( { "userUUID": user.uuid } );
                    }
                }
                const [ accessToken, refreshToken ] = await Promise.all( [
                    this.createAccessToken( { "uuid": user.uuid, "role": userRole, "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                    this.createRefreshToken( { "userUUID": user.uuid } )
                ] );
                const token = {
                    "accessToken": accessToken,
                    "refreshToken": refreshToken
                };

                return { "token": token };
            }
            return this.errorUtil.throwClientError( "نام کاربری یا کلمه عبور اشتباه هست", 400 );
        }
        return this.errorUtil.throwClientError( "ایمیل کاربر تایید نشده است", 400 );
    }

    async loginUserByPhone( phone, key, { deviceToken = null } = {} ) {
        const { userUUID, userType } = await this.verifyPhone( phone, key );
        let userDevice;

        if ( deviceToken ) {
            userDevice = await this.userDeviceService.getById( deviceToken );

            if ( userDevice ) {
                await userDevice.cache().update( { "userUUID": userUUID } );
            }
        }
        const [ accessToken, refreshToken ] = await Promise.all( [
            this.createAccessToken( { "uuid": userUUID, "role": userType, "deviceToken": userDevice ? userDevice.deviceToken : null } ),
            this.createRefreshToken( { "userUUID": userUUID } )
        ] );
        const token = {
            "accessToken": accessToken,
            "refreshToken": refreshToken
        };

        return { "token": token };
    }
    
    async loginCustomerByEmail( email, password, { deviceToken = null } = {} ) {
        const customerUser = await this.userService.getByEmail( email, "customer" );

        if ( customerUser ) {
            return await this.loginUserByEmailAndPassword( "customer", customerUser, password, { deviceToken } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginProviderByEmail( email, password, { deviceToken = null } = {} ) {
        const providerUser = await this.userService.getByEmail( email, "provider" );

        if ( providerUser ) {
            return await this.loginUserByEmailAndPassword( "provider", providerUser, password, { deviceToken } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginProviderAssistantByEmail( email, password, { deviceToken = null } = {} ) {
        const providerAssistantUser = await this.userService.getByEmail( email, "providerAssistant" );

        if ( providerAssistantUser ) {
            return await this.loginUserByEmailAndPassword( "providerAssistant", providerAssistantUser, password, { deviceToken } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginAdminByEmail( email, password ) {
        const adminUser = await this.userService.getByEmail( email, "admin" );

        if ( adminUser ) {
            return await this.loginUserByEmailAndPassword( "admin", adminUser, password );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginCustomerByPhoneSubmitRequest( phone ) {
        const customerUser = await this.userService.getByPhone( phone, "customer" );

        if ( customerUser ) {
            return await this.submitVerifyPhoneRequest( phone, { "userUUID": customerUser.uuid, "userType": "customer" } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginProviderByPhoneSubmitRequest( phone ) {
        const providerUser = await this.userService.getByPhone( phone, "provider" );

        if ( providerUser ) {
            return await this.submitVerifyPhoneRequest( phone, { "userUUID": providerUser.uuid, "userType": "provider" } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async loginProviderAssistantByPhoneSubmitRequest( phone ) {
        const providerAssistant = await this.userService.getByPhone( phone, "providerAssistant" );

        if ( providerAssistant ) {
            const providerAssistantUser = providerAssistant.user;

            return await this.submitVerifyPhoneRequest( phone, { "userUUID": providerAssistantUser.userUUID, "userType": "providerAssistant" } );
        }
        return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
    }

    async logout( token ) {
        await this.tokenUtil.revokeToken( token );
    }

    async signupCustomerByEmail( userObj, customerObj = {}, { deviceToken = null, shareCode = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const user = await this.userService.getOrAdd( { "email": userObj.email }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );
                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            if ( shareCode ) {
                const userShare = await this.userShareService.getByShareCode( shareCode );

                await userShare.cache().update( {
                    "destUserUUID": user.uuid,
                    "status": true
                }, { "transaction": t } );
            }
            const [ customer, accessToken, refreshToken ] = await Promise.all( [
                this.customerService.addCustomerUser( user, customerObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "customer", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };

            this.createAndSendVerifyEmail( user.email, { "userUUID": user.uuid } );
            customer.dataValues.user = user;
            return { customer, token };
        } );
    }

    async signupProviderByEmail( userObj, providerObj, { deviceToken = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const user = await this.userService.getOrAdd( { "email": userObj.email }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );

                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            const [ provider, accessToken, refreshToken ] = await Promise.all( [
                this.providerService.addProviderUser( user, providerObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "provider", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };

            this.createAndSendVerifyEmail( user.email, { "userUUID": user.uuid } );
            provider.dataValues.user = user;
            return { provider, token };
        } );
    }

    async signupProviderAssistantByEmail( userObj, providerAssistantObj, { deviceToken = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const user = await this.userService.add( { "email": userObj.email }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );

                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            const [ providerAssistant, accessToken, refreshToken ] = await Promise.all( [
                this.providerAssistantService.add( userUUID, providerAssistantObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "providerAssistant", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };
            
            this.createAndSendVerifyEmail( user.email, { "userUUID": user.uuid } );
            providerAssistant.dataValues.user = user;
            return { providerAssistant, token };
        } );
    }

    async signupCustomerByPhone( phoneConfirmKey, userObj, customerObj = {}, { deviceToken = null, shareCode = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const phone = await this.getPhoneByPhoneConfirmKey( phoneConfirmKey );
       
            userObj.phone = phone;
            const user = await this.userService.getOrAdd( { "phone": phone }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );

                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            if ( shareCode ) {
                const userShare = await this.userShareService.getByShareCode( shareCode );

                await userShare.cache().update( {
                    "destUserUUID": user.uuid,
                    "status": true
                } );
            }
            const [ customer, accessToken, refreshToken ] = await Promise.all( [
                this.customerService.addCustomerUser( user, customerObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "customer", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };

            customer.dataValues.user = user;
            return { customer, token };
        } );
    }

    async signupProviderByPhone( phoneConfirmKey, userObj, providerObj, { deviceToken = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const phone = await this.getPhoneByPhoneConfirmKey( phoneConfirmKey );

            userObj.phone = phone;
            const user = await this.userService.getOrAdd( { "phone": phone }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );

                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            const [ provider, accessToken, refreshToken ] = await Promise.all( [
                this.providerService.addProviderUser( user, providerObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "provider", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };
            
            provider.dataValues.user = user;
            return { provider, token };
        } );
    }

    async signupProviderAssistantByPhone( phoneConfirmKey, userObj, providerAssistantObj, { deviceToken = null } = {} ) {
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const phone = await this.getPhoneByPhoneConfirmKey( phoneConfirmKey );

            userObj.phone = phone;
            const user = await this.userService.getOrAdd( { "phone": phone }, userObj, { "transaction": t } );
            let userDevice;

            if ( deviceToken ) {
                userDevice = await this.userDeviceService.getById( deviceToken );

                if ( userDevice ) {
                    await userDevice.cache().update( { "userUUID": user.uuid }, { "transaction": t } );
                }
            }
            const [ providerAssistant, accessToken, refreshToken ] = await Promise.all( [
                this.providerAssistantService.addProviderAssistantUser( user, providerAssistantObj, { "transaction": t } ),
                this.createAccessToken( { "uuid": user.uuid, "role": "providerAssistant", "deviceToken": userDevice ? userDevice.deviceToken : null } ),
                this.createRefreshToken( { "userUUID": user.uuid } )
            ] );
            const token = {
                refreshToken,
                accessToken
            };
            
            providerAssistant.dataValues.user = user;
            return { providerAssistant, token };
        } );
        
    }

    async createAndSendVerifyEmail( userEmail, payload = { userUUID } ) {
        const randomString = crypto.randomBytes( 16 ).toString( "hex" );

        await Promise.all( [
            this.redisDbClient.setex( randomString, 900, payload.userUUID ),
            this.jobManagerUtil.addJob( "ball_send_verify_email", {
                "to": userEmail,
                "subject": "تایید ایمیل",
                "payload": {
                    "html": `
                    <p>سلام برای تایید ایمیل خود بر روی لینک زیر کلیک کنید</p>
                    </br>
                    <a href="${appEndpoint}/api/auth/email/verify/callback/${randomString}">اعتبار سنجی ایمیل</a>
                    `
                }
            } )
        ] );
    }

    async createAndSendResetPasswordEmail( userEmail, payload = { userUUID } ) {
        const randomString = crypto.randomBytes( 16 ).toString( "hex" );

        await Promise.all( [
            this.redisDbClient.setex( randomString, 900, payload.userUUID ),
            this.jobManagerUtil.addJob( "offcenter_send_reset_password_email", {
                "to": userEmail,
                "subject": "بازگردانی پسورد",
                "payload": {
                    "html": `
                    <p>سلام برای بازگردانی پسورد خود بر روی لینک زیر کلیک کنید</p>
                    </br>
                    <a href="${appEndpoint}/api/auth/password/reset/callback/${randomString}">بازگردانی پسورد</a>
                    `
                }
            } )
        ] );
    }

    async submitVerifyEmailRequest( email ) {
        const user = await this.userService.getByEmail( email );

        if ( user ) {
            if ( user.emailConfirm ) {
                return this.errorUtil.throwClientError( "ایمیل شما از قبل تایید شده است", 400 );
            }
            await this.createAndSendVerifyEmail( email, { "userUUID": user.uuid } );
        } else {
            return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
        }
    }

    async submitVerifyPhoneRequest( phone, payload = "verifyPhone" ) {
        const randomInteger = Math.floor( 1000 + Math.random() * 9000 );
        const key = `${randomInteger}:${phone}`;

        await Promise.all( [
            this.jobManagerUtil.addJob( "ball_send_verify_sms", { phone, randomInteger } ),
            this.redisDbClient.setex( key, 900, JSON.stringify( payload ) )
        ] );
        return true;
    }

    async submitResetPasswordRequest( email ) {
        const user = await this.userService.getByEmail( email );

        if ( user ) {
            await this.createAndSendResetPasswordEmail( email, { "userUUID": user.uuid } );
        } else {
            return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
        }
    }

    async verifyEmail( key ) {
        const userUUID = await this.redisDbClient.get( key );
        
        if ( userUUID ) {
            const user = await this.userService.getById( userUUID );
           
            await user.cache().update( { "emailConfirm": true } );
            user.cache().client().set( [ 'User', `user_email_${user.email}` ], user );
        } else {
            return this.errorUtil.throwClientError( "کد فرستاده شده اشتباه است احتمالا شما قبلا درخواست تایید ایمیل ندادید و یا مدت زمان شما برای تایید ایمیل به اتمام رسیده است", 400 );
        }
    }

    async verifyPhone( phone, key ) {
        const [ payloadStr, user ] = await Promise.all( [
            this.redisDbClient.get( `${key}:${phone}` ),
            this.userService.getByPhone( phone )
        ] );
        const payload = JSON.parse( payloadStr );
        
        if ( payload === null ) {
            return this.errorUtil.throwClientError( "کد فرستاده شده اشتباه است احتمالا شما قبلا درخواست تایید شماره تلفن را ندادید و یا مدت زمان شما برای تایید شماره تلفن به اتمام رسیده است", 400 );
        } else if ( payload === "verifyPhone" ) {
            await this.redisDbClient.set( `${key}:${phone}`, phone );
            return { "phoneConfirmKey": `${key}:${phone}`, "user": user };
        } else if ( payload === phone ) {
            return { "phoneConfirmKey": `${key}:${phone}` };
        }
        return payload;
    }
    
    async resetPassword( key, password ) {
        const userUUID = await this.redisDbClient.get( key );
        
        if ( userUUID ) {
            await this.userService.editById( userUUID, { "password": password } );
        } else {
            return this.errorUtil.throwClientError( "کد فرستاده شده اشتباه است احتمالا شما قبلا درخواست بازنگری پسورد ندادید و یا مدت زمان شما برای بازگردانی پسورد به اتمام رسیده است", 400 );
        }
    }

    async addResourcePolicy( userUUID, resourceUUID, action ) {
        await this.resourceAuthorizeUtil.addPolicy( userUUID, resourceUUID, action );
    }

    async checkResourceAccess( userUUID, resourceUUID, action ) {
        return await this.resourceAuthorizeUtil.enforce( userUUID, resourceUUID, action );
    }

    async registerDevice( deviceRegisterToken, deviceInformation, userUUID = null ) {
        await this.sequelizeCachingUtil.withCache( this.models.DeviceInfo ).cache().create( {
            deviceRegisterToken,
            deviceInformation,
            userUUID
        } );
    }
}

module.exports = Logics;
