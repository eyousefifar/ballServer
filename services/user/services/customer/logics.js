class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, userService, userWalletService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.userService = userService;
        this.userWalletService = userWalletService;
    }

    async addCustomerUser( user, customerObj, { "transaction": t = null } = {} ) {
        customerObj.userUUID = user.uuid;
        
        if ( user.types ) {
            if ( user.types.includes( "customer" ) ) {
                return this.errorUtil.throwClientError( "چنین کاربری از قبل در سیستم ثبت نام کرده است", 400 );
            }
            user.types.push( "customer" );
        } else {
            user.types = [ "customer" ];
        }
        const [ customer ] = await Promise.all( [
            this.sequelizeCachingUtil.withCache( this.models.Customer ).cache().create( customerObj, { "transaction": t } ),
            user.cache().save( { "transaction": t } )
        ] );

        await this.userWalletService.add( { "userUUID": customer.userUUID }, { "transaction": t } );
        return customer;
    }

    async add( customerObj, { "transaction": t = null } = {} ) {
        const customer = await this.sequelizeCachingUtil.withCache( this.models.Customer ).cache().create( customerObj, { "transaction": t } );

        return customer;
    }

    async editById( userUUID, customerObj ) {
        await this.userService.editById( userUUID, customerObj.userObj );
        const customer = await this.getById( userUUID );

        await customer.cache().update( customerObj );
        return true;
    }

    async getById( userUUID, { "transaction": t = null } = {} ) {
        const customer = await this.sequelizeCachingUtil.withCache( this.models.Customer ).cache().findByPk( userUUID, { "transaction": t } );

        if ( !customer ) {
            return this.errorUtil.throwClientError( "چنین مشتری ثبت نشده است", 404 );
        }
        return customer;
    }

    async getAll( { pageNumber = null, pageSize = null, odataStr = null, getUser = true, userOdataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.attributes = queryObj.attributes ? queryObj.attributes : {};
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.User,
                        "as": "user",
                        "required": true,
                        ...userQueryObj
                    }
                ];
            }
        }
        return await this.models.Customer.findAll( queryObj );
    }
}

module.exports = Logics;
