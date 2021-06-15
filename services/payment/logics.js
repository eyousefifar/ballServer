class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( paymentObj, { "transaction": t = null } = {} ) {
        return await this.models.Payment.create( paymentObj, { "transaction": t } );
    }

    async editById( paymentUUID, paymentObj, { "transaction": t = null } = {} ) {
        const payment = await this.getById( paymentUUID, { "transaction": t } );

        if ( !payment ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ثبت نشده است", 404 );
        }
        await payment.update( paymentObj, { "transaction": t } );
    }

    async getById( paymentUUID, { "transaction": t = null } = {} ) {
        const payment = await this.models.Payment.findByPk( paymentUUID, { "transaction": t } );

        if ( !payment ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ثبت نشده است", 404 );
        }
        return payment;
    }

    async getByTransactionId( paymentTransactionId, { "transaction": t = null } = {} ) {
        return await this.models.Payment.findOne( {
            "where": {
                "paymentTransactionId": {
                    [ this.sequelizeObj.Op.eq ]: paymentTransactionId
                }
            }
        }, { "transaction": t } );
    }

    async getByFactorNumber( paymentFactorNumber, { "transaction": t = null } = {} ) {
        return await this.models.Payment.findOne( {
            "where": {
                "factorNumber": {
                    [ this.sequelizeObj.Op.eq ]: paymentFactorNumber
                }
            }
        }, { "transaction": t } );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Payment.findAll( queryObj );
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.ownerResourceUUID = {
                [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Payment.findAll( queryObj );
    }
}

module.exports = Logics;
