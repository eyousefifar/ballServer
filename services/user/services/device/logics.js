class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
    }

    async add( userDeviceObj, { "transaction": t = null } = {} ) {
        return await this.sequelizeCachingUtil.withCache( this.models.UserDevice ).cache().create( userDeviceObj, { "transaction": t } );
    }

    async editById( deviceToken, userDeviceObj, { "transaction": t } ) {
        const userDevice = await this.getById( deviceToken, { "transaction": t } );

        await userDevice.update( userDeviceObj );
    }

    async getById( deviceToken, { "transaction": t = null } = {} ) {
        const userDevice = await this.sequelizeCachingUtil.withCache( this.models.UserDevice ).cache().findByPk( deviceToken, { "transaction": t } );

        if ( !userDevice ) {
            return this.errorUtil.throwClientError( "چنین دیوایسی ثبت نشده است", 404 );
        }
        return userDevice;
    }

    async getAllForUser( userUUID, { queryObj = null, pageNumber = null, pageSize = null, odataStr = null } = {} ) {
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
        return await this.models.UserDevice.findAll( queryObj );
    }
}

module.exports = Logics;
