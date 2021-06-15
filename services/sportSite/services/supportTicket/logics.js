class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, resourceAuthorizeUtil, sportSiteService, supportTicketService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.supportTicketService = supportTicketService;
    }

    async add( userUUID, sportSiteSupportTicketObj ) {
        sportSiteSupportTicketObj.ownerResourceUUID = sportSiteSupportTicketObj.sportSiteUUID;
        sportSiteSupportTicketObj.ownerResourceType = "SportSite";
        sportSiteSupportTicketObj.userUUID = userUUID;
        const sportSite = await this.sportSiteService.getById( sportSiteSupportTicketObj.sportSiteUUID );
        const sportSiteSupportTicket = await this.supportTicketService.add( sportSiteSupportTicketObj );

        await Promise.all( [
            this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteSupportTicket.uuid, "all" ),
            this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSupportTicket.uuid, "read" ),
            this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSupportTicket.uuid, "edit" )
        ] );
        return sportSiteSupportTicket;
    }

    async getById( sportSiteSupportTicketUUID ) {
        const sportSiteSupportTicket = await this.supportTicketService.getById( sportSiteSupportTicketUUID );

        if ( sportSiteSupportTicket.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین تیکت کسب و کاری ثبت نشده است", 404 );
        }
        return sportSiteSupportTicket;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getUser = true, userOdataStr = null, getComment = false, commentOdataStr = null } = {} ) {
        return await this.supportTicketService.getAllForOwnerResource( sportSiteUUID, { pageNumber, pageSize, odataStr, queryObj, getUser, userOdataStr, getComment, commentOdataStr } );
    }

    async getAllForUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getSportSite = true, sportSiteOdataStr = null, getComment = false, commentOdataStr = null } = {} ) {
        return await this.supportTicketService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, queryObj, getSportSite, sportSiteOdataStr, getComment, commentOdataStr } );
    }

    async checkExist( sportSiteSupportTicketUUID ) {
        const supportTicket = await this.supportTicketService.getById( sportSiteSupportTicketUUID );

        if ( supportTicket.ownerResourceType !== "SportSite" ) {
            return false;
        }
        return true;
    }
}

module.exports = Logics;
