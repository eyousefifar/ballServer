class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( banerObj, { "transaction": t = null } = {} ) {
        return await this.models.Baner.create( banerObj, { "transaction": t } );
    }

    async editById( banerUUID, banerObj, { "transaction": t = null } = {} ) {
        const baner = await this.getById( banerUUID, { "transaction": t } );

        await baner.update( banerObj, { "transaction": t } );
    }

    async removeById( banerUUID, { "transaction": t = null } = {} ) {
        const baner = await this.getById( banerUUID );

        await baner.destroy( { "transaction": t } );
    }

    async getById( banerUUID, { "transaction": t = null } = {} ) {
        const baner = await this.models.Baner.findByPk( banerUUID, { "transaction": t } );

        if ( !baner ) {
            return this.errorUtil.throwClientError( "چنین بنری ثبت نشده است", 404 );
        }
        return baner;
    }

    async getAll( { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Baner.findAll( queryObj );
    }
}

module.exports = Logics;
