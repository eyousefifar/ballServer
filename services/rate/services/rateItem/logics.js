class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( rateItemObj, { "transaction": t = null } = {} ) {
        return await this.models.RateItem.create( rateItemObj, { "transaction": t } );
    }

    async addBulk( rateItemObjs, { "transaction": t = null } = {} ) {
        return await this.models.RateItem.bulkCreate( rateItemObjs, { "transaction": t } );
    }

    async editById( rateItemUUID, rateItemObj, { "transaction": t = null } = {} ) {
        const rateItem = await this.getById( rateItemUUID, { "transaction": t } );

        await rateItem.update( rateItemObj, { "transaction": t } );
    }

    async getById( rateItemUUID, { "transaction": t = null } = {} ) {
        const rateItem = await this.models.RateItem.findByPk( rateItemUUID, { "transaction": t } );

        if ( !rateItem ) {
            return this.errorUtil.throwClientError( "چنین آیتم امتیازدهی در سیستم وجود ندارد", 404 );
        }
        return rateItem;
    }

    async getAllForRate( rateUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.rateUUID = {
                [ this.sequelizeObj.Op.eq ]: rateUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.RateItem.findAll( queryObj );
    }
}

module.exports = Logics;
