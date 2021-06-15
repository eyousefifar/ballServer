class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, hdateService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.hdateService = hdateService;
    }

    async add( userUUID, sportSiteHdateObj ) {
        const sportSite = await this.sportSiteService.checkExistById( sportSiteHdateObj.sportSiteUUID );

        if ( !sportSite ) {
            return this.errorUtil.throwClientError( "چنین سایت ورزشی ثبت نشده است", 404 );
        }
        const sportSiteHdate = await this.models.Hdate.create( sportSiteHdateObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteHdate.uuid, "all" );
        return sportSiteHdate;
    }

    async editById( sportSiteHdateUUID, sportSiteHdateObj ) {
        const sportSiteHdate = await this.getById( sportSiteHdateUUID );

        await sportSiteHdate.update( sportSiteHdateObj );
    }

    async removeById( sportSiteHdateUUID ) {
        const sportSiteHdate = await this.getById( sportSiteHdateUUID );
        
        await sportSiteHdate.destroy();
    }

    async getById( sportSiteHdateUUID ) {
        const sportSiteHdate = await this.models.Hdate.findByPk( sportSiteHdateUUID );

        if ( !sportSiteHdate ) {
            return this.errorUtil.throwClientError( "چنین تاریخ تعطیلی ثبت نشده است", 404 );
        }
        return sportSiteHdate;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};

            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.sportSiteUUID = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Hdate.findAll( queryObj );
    }

    async getForSportSiteByDate( sportSiteUUID, date ) {
        let queryObj = {};

        queryObj.where = {
            [ this.sequelizeObj.Op.and ]: [
                {
                    "date": {
                        [ this.sequelizeObj.Op.eq ]: date
                    }
                },
                {
                    "sportSiteUUID": {
                        [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                    }
                }
            ]
        };
        return await this.models.Hdate.findOne( queryObj );
    }
}

module.exports = Logics;
