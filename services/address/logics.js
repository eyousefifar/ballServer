class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( addressObj, { "transaction": t = null } = {} ) {
        return await this.models.Address.create( addressObj, { "transaction": t } );
    }

    async editById( addressUUID, addressObj, { "transaction": t = null } = {} ) {
        const address = await this.getById( addressUUID, { "transaction": t } );

        await address.update( addressObj, { "transaction": t } );
    }

    async getById( addressUUID, { "transaction": t = null } = {} ) {
        const address = await this.models.Address.findByPk( addressUUID, { "transaction": t } );

        if ( !address ) {
            return this.errorUtil.throwClientError( "چنین آدرسی ثبت نشده است", 404 );
        }
        return address;
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
        return await this.models.Address.findAll( queryObj );
    }
}

module.exports = Logics;
