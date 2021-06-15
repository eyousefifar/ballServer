class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, likeService, sportSiteService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.likeService = likeService;
        this.sportSiteService = sportSiteService;
    }

    async add( userUUID, sportSiteSessionTimeObj ) {
        const sportSiteSessionTime = await this.models.SessionTime.create( sportSiteSessionTimeObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteSessionTime.uuid, "all" );
        return sportSiteSessionTime;
    }

    async editById( sportSiteSessionTimeUUID, sportSiteSessionTimeObj ) {
        const sportSiteSessionTime = await this.getById( sportSiteSessionTimeUUID );

        if ( !sportSiteSessionTime ) {
            return this.errorUtil.throwClientError( "چنین بازه زمانی ای برای این سایت ورزشی ثبت نشده است", 400 );
        }
        sportSiteSessionTime.update( sportSiteSessionTimeObj );
    }

    async getById( sportSiteSessionTimeUUID ) {
        const sportSiteSessionTime = await this.models.SessionTime.findByPk( sportSiteSessionTimeUUID );

        if ( !sportSiteSessionTime ) {
            return this.errorUtil.throwClientError( "چنین بازه زمانی ای برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return sportSiteSessionTime;
    }

    async getOrAdd( userUUID, sportSiteSessionTimeObj ) {
        const sportSiteSessionTime = await this.models.SessionTime.findOne( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "startTime": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteSessionTimeObj.startTime
                        }
                    },
                    {
                        "endTime": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteSessionTimeObj.endTime
                        }
                    }
                ]
            }
        } );

        if ( !sportSiteSessionTime ) {
            return await this.add( userUUID, sportSiteSessionTimeObj );
        }
        return sportSiteSessionTime;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            const queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};

            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.sportSiteUUID = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.SessionTime.findAll( queryObj );
    }

    async getAllBetweenTimes( sportSiteWorkPlanStartTime, sportSiteWorkPlanEndTime, { odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};

            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where = {
                ...queryObj.where,
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "startTime": {
                            [ this.sequelizeObj.Op.gte ]: sportSiteWorkPlanStartTime
                        }
                    },
                    {
                        "endTime": {
                            [ this.sequelizeObj.Op.lte ]: sportSiteWorkPlanEndTime
                        }
                    }
                ]
            };
        }
        return await this.models.SessionTime.findAll( queryObj );
    }

    async checkExistByTimes( sportSiteWorkPlanStartTime, sportSiteWorkPlanEndTime ) {
        return await this.models.SessionTime.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "startTime": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteWorkPlanStartTime
                        }
                    },
                    {
                        "endTime": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteWorkPlanEndTime
                        }
                    }
                ]
            }
        } ) > 0;
    }
}

module.exports = Logics;
