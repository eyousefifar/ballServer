class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, userService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.userService = userService;
    }

    async add( customerCreditObj, { "transaction": t = null } = {} ) {
        const user = this.userService.checkExist( customerCreditObj.userUUID );

        if ( user ) {
            return this.errorUtil.throwClientError( "چنین کاربری ثبت نشده است", 404 );
        }
        return await this.models.CustomerCredit.create( customerCreditObj, { "transaction": t } );
    }

    async editById( customerCreditUUID, customerCreditObj ) {
        const customerCredit = await this.models.CustomerCredit.findByPk( customerCreditUUID, { "transaction": t } );

        if ( !customerCredit ) {
            return this.errorUtil.throwClientError( "چنین اعتباری ثبت نشده است", 404 );
        }
        await customerCredit.update( customerCreditObj );
    }

    async getById( customerCreditUUID, { "transaction": t = null } = {} ) {
        const customerCredit = await this.models.CustomerCredit.findByPk( customerCreditUUID, { "transaction": t } );

        if ( !customerCredit ) {
            return this.errorUtil.throwClientError( "چنین اعتباری ثبت نشده است", 404 );
        }
        return customerCredit;
    }

    async getAllForUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            queryObj.attributes = queryObj.attributes ? queryObj.attributes : {};
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.CustomerCredit.findAll( queryObj );
    }

    async getBestUsableForUser( userUUID ) {
        return await this.models.CustomerCredit.findOne( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    {
                        "creditUsageLimit": {
                            [ this.sequelizeObj.Op.gt ]: 0
                        }
                    }
                ]
            },
            "order": [ [ "creditAmountPerUsage", "DESC" ] ],
            "limit": 1
        } );
    }
}

module.exports = Logics;
