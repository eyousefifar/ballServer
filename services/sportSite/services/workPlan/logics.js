class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, workPlanService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.workPlanService = workPlanService;
    }

    async add( userUUID, sportSiteWorkPlanObj ) {
        const sportSite = await this.sportSiteService.checkExistById( sportSiteWorkPlanObj.sportSiteUUID );

        if ( !sportSite ) {
            return this.errorUtil.throwClientError( "چنین سایت ورزشی ثبت نشده است", 404 );
        }
        const sportSiteWorkPlan = await this.models.WorkPlan.create( workPlanObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteWorkPlan.uuid, "all" );
        return sportSiteWorkPlan;
    }

    async editById( sportSiteWorkPlanUUID, sportSiteWorkPlanObj ) {
        const sportSiteWorkPlan = await this.getById( sportSiteWorkPlanUUID );
        
        await sportSiteWorkPlan.update( sportSiteWorkPlanObj );
    }

    async removeById( sportSiteWorkPlanUUID ) {
        const sportSiteWorkPlan = await this.getById( sportSiteWorkPlanUUID );
        
        await sportSiteWorkPlan.destroy();
    }

    async getById( sportSiteWorkPlanUUID ) {
        const sportSiteWorkPlan = await this.models.WorkPlan.findByPk( sportSiteWorkPlanUUID );

        if ( !sportSiteWorkPlan ) {
            return this.errorUtil.throwClientError( "چنین زمان کاری ثبت نشده است", 404 );
        }
        return sportSiteWorkPlan;
    }

    async getAllForSportSite( sportSiteUUID, { odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.sportSiteUUID = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
        }
        return await this.models.WorkPlan.findAll( queryObj );
    }
}

module.exports = Logics;
