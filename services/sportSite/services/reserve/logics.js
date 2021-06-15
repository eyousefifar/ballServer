const { providerPrecent, paymentCallbackUrl } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, { paymentUtil, paymentUtilMode },
        resourceAuthorizeUtil, userService, customerCreditService, sportSiteService, sportSiteSessionService, sportSiteSessionTimeService,
        sportSiteDiscountService, paymentService, walletService, walletTransactionService, notificationService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.paymentUtil = paymentUtil;
        this.paymentUtilMode = paymentUtilMode;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.userService = userService;
        this.customerCreditService = customerCreditService;
        this.sportSiteService = sportSiteService;
        this.sportSiteSessionService = sportSiteSessionService;
        this.sportSiteSessionTimeService = sportSiteSessionTimeService;
        this.sportSiteDiscountService = sportSiteDiscountService;
        this.paymentService = paymentService;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.notificationService = notificationService;
    }

    async reserveItemPriceCalculator( reserveItem, nowDate ) {
        const reserveItemSessionPrice = reserveItem.sportSiteSession.price;
        const reserveItemSessionDiscountPrecent = reserveItem.sportSiteSession.discountPrecent;
        const reserveItemSessionDiscountExpireDate = reserveItem.sportSiteSession.discountExpireDate;
        let reserveItemPrice = reserveItemSessionPrice * reserveItem.count;
        let finalReserveItemPrice;

        if ( reserveItemSessionDiscountPrecent && reserveItemSessionDiscountExpireDate && reserveItemSessionDiscountExpireDate > nowDate ) {
            finalReserveItemPrice = ( reserveItemSessionPrice - ( reserveItemSessionPrice * ( reserveItemSessionDiscountPrecent / 100 ) ) ) * reserveItem.count;
        } else {
            finalReserveItemPrice = reserveItemPrice;
        }
        return { reserveItemPrice, finalReserveItemPrice };
    }

    async serializeReserveItem( sportSiteReserveItemObj, sportSiteUUID ) {
        sportSiteReserveItemObj.sportSiteSession = await this.sportSiteSessionService.getForSportSite( sportSiteUUID, sportSiteReserveItemObj.sportSiteSessionUUID );
    }

    async validateAndSerializeReserveItem( sportSiteUUID, sportSiteReserveItemObj, sportSiteReserveDate ) {
        await this.serializeReserveItem( sportSiteReserveItemObj, sportSiteUUID );
        const sportSiteReserveItemSession = sportSiteReserveItemObj.sportSiteSession;

        if ( sportSiteReserveItemSession.capacity < sportSiteReserveItemObj.count ) {
            return this.errorUtil.throwClientError( `تعداد بلیط درخواستی سانس ${sportSiteReserveItemSession.uuid} بیش تر از حد ممکن است`, 400 );
        }
        if ( sportSiteReserveItemSession.isDynamic && sportSiteReserveItemObj.count ) {
            if ( sportSiteReserveItemObj.count > 1 ) {
                return this.errorUtil.throwClientError( "امکان رزرو سانس های متغیر بیش از یک بار توسط یک فرد وجود ندارد", 400 );
            }
        } else if ( sportSiteReserveItemSession.isDynamic ) {
            sportSiteReserveItemObj.count = 1;
        }
        const sportSiteReserveItemSessionTime = await this.sportSiteSessionTimeService.getById( sportSiteReserveItemSession.sessionTimeUUID );

        if ( !sportSiteReserveItemSession.isDynamic && await this.sportSiteSessionService.checkExpire( { "startTime": sportSiteReserveItemSessionTime.startTime, "endTime": sportSiteReserveItemSessionTime.endTime, "date": sportSiteReserveItemSession.date, "nowDate": sportSiteReserveDate } ) ) {
            return this.errorUtil.throwClientError( `زمان سانس ${sportSiteReserveItemSession.uuid} گذشته است`, 400 );
        }
    }

    async validateAndSerializeReserveItems( sportSiteUUID, sportSiteReserveItemObjs, sportSiteReserveDate ) {
        for ( const sportSiteReserveItemObj of sportSiteReserveItemObjs ) {
            await this.validateAndSerializeReserveItem( sportSiteUUID, sportSiteReserveItemObj, sportSiteReserveDate );
        }
    }

    async calculateReservePrice( sportSiteReserveItemObjs, privateDiscount = null, customerCredit = null ) {
        const nowDate = new Date();
        let finalReserveItemsPrice = 0;
        let totalReserveItemsPrice = 0;
        let creditAmount = 0;

        for ( const sportSiteReserveItemObj of sportSiteReserveItemObjs ) {
            const { reserveItemPrice, finalReserveItemPrice } = await this.reserveItemPriceCalculator( sportSiteReserveItemObj, nowDate );

            totalReserveItemsPrice += reserveItemPrice;
            finalReserveItemsPrice += finalReserveItemPrice;
        }
        if ( customerCredit ) {
            if ( customerCredit.creditUsageLimit > 0 ) {
                customerCredit.update( { "creditUsageLimit": customerCredit.creditUsageLimit - 1 } );
                creditAmount = customerCredit.creditAmountPerUsage;
                finalReserveItemsPrice -= creditAmount;
            }
        }
        if ( privateDiscount ) {
            finalReserveItemsPrice = ( finalReserveItemsPrice - ( ( privateDiscount.precent / 100 ) * finalReserveItemsPrice ) );
        }
        return { finalReserveItemsPrice, totalReserveItemsPrice };
    }

    async addByWalletPaymentType( userUUID, sportSiteReserveObj, sportSiteReserveItemObjs ) {
        const sportSiteReserveDate = new Date();
        const [ , sportSite ] = await Promise.all( [
            this.userService.getById( userUUID ),
            this.sportSiteService.getById( sportSiteReserveObj.sportSiteUUID )
        ] );
        let privateDiscount = null;

        if ( sportSiteReserveObj.discountCode ) {
            privateDiscount = await this.sportSiteDiscountService.getForSportSiteAndValidateByCode( userUUID, sportSiteReserveObj.discountCode, sportSiteReserveObj.sportSiteUUID );
        }
        let [ userWallet, sportSiteWallet, customerCredit ] = await Promise.all( [
            this.walletService.getForOwnerResource( userUUID ),
            this.walletService.getForOwnerResource( sportSiteReserveObj.sportSiteUUID ),
            this.customerCreditService.getBestUsableForUser( userUUID ),
            this.validateAndSerializeReserveItems( sportSiteReserveObj.sportSiteUUID, sportSiteReserveItemObjs, sportSiteReserveDate )
        ] );
        const { finalReserveItemsPrice, totalReserveItemsPrice } = await this.calculateReservePrice( sportSiteReserveItemObjs, privateDiscount, customerCredit );
        
        if ( userWallet.amount < finalReserveItemsPrice ) {
            return this.errorUtil.throwClientError( "موجودی حساب کافی نیست", 400 );
        }
        const sportSiteReserveItems = [];
        
        return await this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const [ userWalletTransaction ] = await Promise.all( [
                this.walletTransactionService.add( {
                    "amount": finalReserveItemsPrice,
                    "transactionType": "dec",
                    "description": `رزرو از مجموعه ${sportSite.name}`,
                    "walletUUID": userWallet.uuid
                }, { "transaction": t } ),
                this.walletTransactionService.add( {
                    "amount": finalReserveItemsPrice,
                    "transactionType": "inc",
                    "description": `رزرو کاربر از مجموعه`,
                    "walletUUID": sportSiteWallet.uuid
                }, { "transaction": t } ),
                userWallet.update( {
                    "amount": this.sequelizeDbObj.literal( `amount - ${finalReserveItemsPrice}` )
                }, { "transaction": t } ),
                sportSiteWallet.update( {
                    "amount": this.sequelizeDbObj.literal( `amount + ${finalReserveItemsPrice * providerPrecent / 100}` )
                }, { "transaction": t } )
            ] );
            const sportSiteReserve = await this.models.Reserve.create(
                {
                    "userUUID": userUUID,
                    "walletTransactionUUID": userWalletTransaction.uuid,
                    "totalItemsPrice": totalReserveItemsPrice,
                    "finalPrice": finalReserveItemsPrice,
                    "sportSiteUUID": sportSite.uuid,
                    "submitStatus": true
                }, { "transaction": t } );
            await Promise.all( [
                this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteReserve.uuid, "all" ),
                this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteReserve.uuid, "all" )
            ] );
            for ( const sportSiteReserveItemObj of sportSiteReserveItemObjs ) {
                const sportSiteSession = sportSiteReserveItemObj.sportSiteSession;

                if ( sportSiteSession.reservesCount + sportSiteReserveItemObj.count > sportSiteSession.capacity ) {
                    return this.errorUtil.throwClientError( "ظرفیت سانس به پایان رسیده است و یا تعداد درخواستی بیش از حد مجاز است", 400 );
                }
                const [ , sportSiteReserveItem ] = await Promise.all( [
                    sportSiteSession.update( {
                        "reservesCount": sportSiteSession.reservesCount + sportSiteReserveItemObj.count
                    }, { "transaction": t } ),
                    this.models.ReserveItem.create(
                        {
                            "sessionUUID": sportSiteSession.uuid,
                            "reserveUUID": sportSiteReserve.uuid,
                            "code": ( new Date() ).valueOf(),
                            "count": sportSiteReserveItemObj.count,
                            "information": sportSiteReserveItemObj.information
                        }, { "transaction": t } )
                ] );
                await Promise.all( [
                    this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteReserveItem.uuid, "all" ),
                    this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteReserveItem.uuid, "all" ),
                    this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, `sportSiteReserveItem_${sportSiteReserveItem.code}`, "all" )
                ] );
                sportSiteReserveItems.push( sportSiteReserveItem );
            }
            if ( privateDiscount ) {
                await this.sportSiteDiscountService.useDiscount( userUUID, privateDiscount, { "transaction": t } );
            }
            await this.notificationService.add( {
                "title": "رزرو",
                "content": `رزرو شما از مجموعه ی ${sportSite.name} با موفقیت انجام شد`,
                "userUUID": userUUID
            }, { "sendToAllUserDevices": true }, { "transaction": t } );
            sportSiteReserve.dataValues.reserveItems = sportSiteReserveItems;
            return sportSiteReserve;
        } );
    }

    async submitAddReserveByDirectPaymentTypeRequest( userUUID, sportSiteReserveObj, sportSiteReserveItemObjs ) {
        const sportSiteReserveDate = new Date();
        const factorNumber = sportSiteReserveDate.valueOf();
        const [ sportSite, user, customerCredit ] = await Promise.all( [
            this.sportSiteService.getById( sportSiteReserveObj.sportSiteUUID ),
            this.userService.getById( userUUID ),
            this.customerCreditService.getBestUsableForUser( userUUID )
        ] );
        let privateDiscount = null;

        if ( sportSiteReserveObj.discountCode ) {
            privateDiscount = await this.sportSiteDiscountService.getForSportSiteAndValidateByCode( userUUID, sportSiteReserveObj.discountCode, sportSiteReserveObj.sportSiteUUID );
        }
        await this.validateAndSerializeReserveItems( sportSiteReserveObj.sportSiteUUID, sportSiteReserveItemObjs, sportSiteReserveDate );
        const { finalReserveItemsPrice, totalReserveItemsPrice } = await this.calculateReservePrice( sportSiteReserveItemObjs, privateDiscount, customerCredit );

        return await this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const payment = await this.paymentService.add(
                {
                    "amount": finalReserveItemsPrice,
                    "userUUID": userUUID,
                    "factorNumber": factorNumber,
                    "paymentType": "رزرو مستقیم",
                    "description": `رزرو از مجموعه ${sportSite.name}`
                }, { "transaction": t } );
            const sportSiteReserve = await this.models.Reserve.create(
                {
                    "userUUID": userUUID,
                    "paymentUUID": payment.uuid,
                    "directPaymentToken": payment.paymentToken,
                    "totalItemsPrice": totalReserveItemsPrice,
                    "finalPrice": finalReserveItemsPrice,
                    "sportSiteUUID": sportSiteReserveObj.sportSiteUUID
                }, { "transaction": t } );
            
            for ( const sportSiteReserveItemObj of sportSiteReserveItemObjs ) {
                const sportSiteSession = sportSiteReserveItemObj.sportSiteSession;
                const sportSiteSessionLockAt = sportSiteSession.lockAt;

                if ( sportSiteSession.reservesCount + sportSiteReserveItemObj.count > sportSiteSession.capacity ) {
                    return this.errorUtil.throwClientError( "ظرفیت سانس به پایان رسیده است و یا تعداد درخواستی بیش از حد مجاز است", 400 );
                }
                if ( sportSiteSessionLockAt ) {
                    sportSiteSessionLockAt.setMinutes( sportSiteSessionLockAt.getMinutes() + 10 );
                    if ( sportSiteSessionLockAt > sportSiteReserveDate ) {
                        return this.errorUtil.throwClientError( "متاسفانه شخص دیگری در حال رزرو کردن است تا مشخص شدن وضعیت صبر کنید", 400 );
                    }
                    sportSiteSession.update( { "lockAt": null }, { "transaction": t } );
                }
                await Promise.all( [
                    sportSiteSession.update( { "lockAt": Date.now() }, { "transaction": t } ),
                    this.models.ReserveItem.create(
                        {
                            "sessionUUID": sportSiteSession.uuid,
                            "reserveUUID": sportSiteReserve.uuid,
                            "code": ( new Date() ).valueOf(),
                            "count": sportSiteReserveItemObj.count,
                            "information": sportSiteReserveItemObj.information
                        }, { "transaction": t } )
                ] );
            }
            if ( privateDiscount ) {
                await this.sportSiteDiscountService.useDiscount( userUUID, privateDiscount, { "transaction": t } );
            }
            let paymentResult;
            
            if ( this.paymentUtilMode === "payping" ) {
                paymentResult = await this.paymentUtil.send( finalReserveItemsPrice, paymentCallbackUrl, payment.uuid, {
                    "payerName": user.name,
                    "description": `رزرو از مجموعه ${sportSite.name}`
                } );
            } else if ( this.paymentUtilMode === "payir" ) {
                paymentResult = await this.paymentUtil.send( finalReserveItemsPrice, paymentCallbackUrl, factorNumber );
            }
            return { "paymentLink": paymentResult.paymentLink };
        } );
    }

    async verifyAddByDirectPaymentTypeRequestForPayPing( refId, clientRefId ) {
        const payment = await this.paymentService.getById( clientRefId );

        if ( payment.transactionId ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ازقبل در سیستم وجود دارد", 400 );
        }
        const sportSiteReserve = await this.models.Reserve.findOne( {
            "where": {
                "paymentUUID": {
                    [ this.sequelizeObj.Op.eq ]: payment.uuid
                }
            }
        } );
        const sportSiteReserveItems = await sportSiteReserve.getReserveItems();

        return await this.sequelizeDbObj.transaction( async( t ) => {
            await Promise.all( [
                this.paymentUtil.verify( refId, payment.amount ),
                payment.update( {
                    "transactionId": refId,
                    "status": true
                }, { "transaction": t } )
            ] );
            return await this.addByDirectPaymentType( sportSiteReserve, sportSiteReserveItems, { "transaction": t } );
        } );
    }

    async verifyAddByDirectPaymentTypeRequestForPayIr( paymentToken ) {
        const { factorNumber, transId } = await this.paymentUtil.verify( paymentToken );
        const payment = await this.paymentService.getByFactorNumber( factorNumber );

        if ( payment.transactionId ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ازقبل در سیستم وجود دارد", 400 );
        }
        const sportSiteReserve = await this.models.Reserve.findOne( {
            "where": {
                "paymentUUID": {
                    [ this.sequelizeObj.Op.eq ]: payment.uuid
                }
            }
        } );
        const sportSiteReserveItems = await sportSiteReserve.getReserveItems();
        
        return await this.sequelizeDbObj.transaction( async( t ) => {
            await payment.update( {
                "transactionId": transId,
                "status": true
            }, { "transaction": t } );
            return await this.addByDirectPaymentType( sportSiteReserve, sportSiteReserveItems, { "transaction": t } );
        } );
    }

    async addByDirectPaymentType( sportSiteReserve, sportSiteReserveItems, { "transaction": t = null } = {} ) {
        for ( const sportSiteReserveItem of sportSiteReserveItems ) {
            const sportSiteReserveItemSession = sportSiteReserveItem.sportSiteSession = await this.sportSiteSessionService.getById( "customer", sportSiteReserveItem.sessionUUID );
            
            await sportSiteReserveItemSession.update( {
                "reservesCount": sportSiteReserveItemSession.reservesCount + sportSiteReserveItem.count,
                "lockAt": null
            }, { "transaction": t } );
        }
    
        const [ sportSite, customerShare ] = await Promise.all( [
            this.sportSiteService.getById( sportSiteReserve.sportSiteUUID ),
            this.models.UserShare.findOne( {
                "where": {
                    "destUserUUID": {
                        [ this.sequelizeObj.Op.eq ]: sportSiteReserve.userUUID
                    }
                }
            } )
        ] ) ;

        if ( customerShare ) {
            // todo
        }
        const sportSiteWallet = await this.walletService.getForOwnerResource( sportSite.uuid );

        await Promise.all( [
            sportSiteReserve.update( { "submitStatus": true }, { "transaction": t } ),
            this.walletTransactionService.add( {
                "amount": sportSiteReserve.finalPrice,
                "transactionType": "dec",
                "description": "رزرو کاربر از مجموعه",
                "walletUUID": sportSiteWallet.uuid
            }, { "transaction": t } ),
            sportSiteWallet.update( {
                "amount": this.sequelizeDbObj.literal( `amount + ${sportSiteReserve.finalPrice * providerPrecent}` )
            }, { "transaction": t } )
        ] );
        await Promise.all( [
            this.resourceAuthorizeUtil.addResourcePolicy( sportSiteReserve.userUUID, sportSiteReserve.uuid, "all" ),
            this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteReserve.uuid, "all" )
        ] );
        for ( const sportSiteReserveItem of sportSiteReserveItems ) {
            await Promise.all( [
                this.resourceAuthorizeUtil.addResourcePolicy( sportSiteReserve.userUUID, sportSiteReserveItem.uuid, "all" ),
                this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteReserveItem.uuid, "all" ),
                this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, `sportSiteReserveItem_${sportSiteReserveItem.code}`, "all" )
            ] );
        }
        await this.notificationService.add( {
            "title": "رزرو",
            "content": `رزرو شما از مجموعه ی ${sportSite.name} با موفقیت انجام شد`,
            "userUUID": sportSiteReserve.userUUID
        }, { "sendToAllUserDevices": true }, { "transaction": t } );
        sportSiteReserve.dataValues.reserveItems = sportSiteReserveItems;
        return sportSiteReserve;
    }

    async getById( sportSiteReserveUUID, { odataStr = null, queryObj = null } = {} ) {
        queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
        queryObj.where = queryObj.where ? queryObj.where : {};
        queryObj.where.uuid = {
            [ this.sequelizeObj.Op.eq ]: sportSiteReserveUUID
        };
        return await this.models.Reserve.findOne( queryObj );
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getReserveItem = true, reserveItemOdataStr = null, getUser = true, userOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.sportSiteUUID = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
            queryObj.include = [];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getReserveItem === true || getReserveItem === "true" ) {
                const reserveItemQueryObj = reserveItemOdataStr ? this.sequelizeOdataUtil( reserveItemOdataStr ) : {};

                queryObj.include.push(
                    {
                        "model": this.models.ReserveItem,
                        "as": "reserveItems",
                        ...reserveItemQueryObj
                    }
                );
            }
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include.push(
                    {
                        "model": this.models.User,
                        "as": "user",
                        ...userQueryObj
                    }
                );
            }
        }
        return await this.models.Reserve.findAll( queryObj );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getReserveItem = true, reserveItemOdataStr = null, getSportSite = true, sportSiteOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            queryObj.include = [];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getReserveItem === true || getReserveItem === "true" ) {
                const reserveItemQueryObj = reserveItemOdataStr ? this.sequelizeOdataUtil( reserveItemOdataStr ) : {};

                queryObj.include.push(
                    {
                        "model": this.models.ReserveItem,
                        "as": "reserveItems",
                        ...reserveItemQueryObj
                    }
                );
            }
            if ( getSportSite === true || getSportSite === "true" ) {
                const sportSiteQueryObj = sportSiteOdataStr ? this.sequelizeOdataUtil( sportSiteOdataStr ) : {};

                queryObj.include.push(
                    {
                        "model": this.models.SportSite,
                        "as": "sportSite",
                        ...sportSiteQueryObj
                    }
                );
            }
        }
        return await this.models.Reserve.findAll( queryObj );
    }

    async getForOwnerUserAndSportSite( userUUID, sportSiteUUID ) {
        return await this.models.Reserve.findOne( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    {
                        "sportSiteUUID": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                        }
                    }
                ]
            }
        } );
    }

    async checkExistSubmitedForOwnerUserAndSportSite( userUUID, sportSiteUUID ) {
        const result = await this.models.Reserve.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    {
                        "sportSiteUUID": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                        }
                    },
                    {
                        "submitStatus": {
                            [ this.sequelizeObj.Op.eq ]: true
                        }
                    }
                ]
            }
        } );

        return !!result;
    }
}

module.exports = Logics;
