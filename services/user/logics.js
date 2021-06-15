const argon = require( "argon2" );

class Logics {
    constructor( { models, sequelizeObj }, errorUtil, tokenUtil, sequelizeCachingUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.tokenUtil = tokenUtil;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
    }

    async add( userObj, { "transaction": t = null } = {} ) {
        if ( userObj.password ) {
            const passHash = await argon.hash( userObj.password );

            userObj.password = passHash;
        }
        return await this.sequelizeCachingUtil.withCache( this.models.User ).cache().create( userObj, { "transaction": t } );
    }

    async editById( userUUID, userObj ) {
        const user = await this.getById( userUUID );

        if ( userObj.password ) {
            userObj.password = await argon.hash( userObj.password );
        }
        if ( userObj.email ) {
            userObj.emailConfirm = false;
        }
        await user.cache().update( userObj );
    }

    async getById( userUUID, { "transaction": t = null } = {} ) {
        const user = await this.sequelizeCachingUtil.withCache( this.models.User ).cache().findByPk( userUUID, { "transaction": t } );
        
        if ( !user ) {
            return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
        }
        return user;
    }

    async getOrAdd( { email, phone }, userObj, { "transaction": t = null } = {} ) {
        if ( userObj.password ) {
            const passHash = await argon.hash( userObj.password );
            
            userObj.password = passHash;
        }
        let user;

        if ( email ) {
            user = await this.getByEmail( email );
        } else if ( !email && phone ) {
            user = await this.getByPhone( phone );
        } else {
            throw new Error( "userEmail or userPhone is required" );
        }
        if ( !user ) {
            user = await this.sequelizeCachingUtil.withCache( this.models.User ).cache().create( userObj, { "transaction": t } );
        }
        return user;
    }

    async getByEmail( email, userType = null ) {
        return await this.sequelizeCachingUtil.withCache( this.models.User ).cache( `user_email_${email}` ).findOne( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "email": {
                            [ this.sequelizeObj.Op.eq ]: email
                        }
                    },
                    (
                        () => (
                            userType ? {
                                "types": {
                                    [ this.sequelizeObj.Op.contains ]: [ userType ]
                                }
                            } : {}
                        )
                    )()
                ]
            }
        } );
    }

    async getByPhone( phone, userType = null ) {
        return await this.sequelizeCachingUtil.withCache( this.models.User ).cache( `user_phone_${phone}` ).findOne( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "phone": {
                            [ this.sequelizeObj.Op.eq ]: phone
                        }
                    },
                    (
                        ( ) => (
                            userType ? {
                                "types": {
                                    [ this.sequelizeObj.Op.contains ]: [ userType ]
                                }
                            } : {}
                        )
                    )()
                ]
            }
        } );
    }

    async checkExistByEmail( userType, email ) {
        let userCount;

        userCount = await this.models.User.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "email": {
                            [ this.sequelizeObj.Op.eq ]: email
                        }
                    },
                    {
                        "types": {
                            [ this.sequelizeObj.Op.contains ]: [ userType ]
                        }
                    }
                ]
            }
        } );
        return !!userCount;
    }

    async checkExistByPhone( userType, phone ) {
        let userCount;

        userCount = await this.models.User.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "phone": {
                            [ this.sequelizeObj.Op.eq ]: phone
                        }
                    },
                    {
                        "types": {
                            [ this.sequelizeObj.Op.contains ]: [ userType ]
                        }
                    }
                ]
            }
        } );
        return !!userCount;
    }
}

module.exports = Logics;
