class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, supportTicketCommentService, sportSiteSupportTicketService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.sportSiteSupportTicketService = sportSiteSupportTicketService;
        this.supportTicketCommentService = supportTicketCommentService;
    }

    async add( userType, userUUID, sportSiteSupportTicketCommentObj ) {
        sportSiteSupportTicketCommentObj.userUUID = userUUID;
        sportSiteSupportTicketCommentObj.userType = userType;
        sportSiteSupportTicketCommentObj.supportTicketUUID = sportSiteSupportTicketCommentObj.sportSiteSupportTicketUUID;
        const sportSiteSupportTicket = await this.sportSiteSupportTicketService.getById( sportSiteSupportTicketCommentObj.sportSiteSupportTicketUUID );
        const sportSite = await this.sportSiteService.getById( sportSiteSupportTicket.ownerResourceUUID );
        const sportSiteSupportTicketComment = await this.supportTicketCommentService.add( sportSiteSupportTicket, sportSiteSupportTicketCommentObj );
        
        await Promise.all( [
            ( () => sportSiteSupportTicketCommentObj.userType === "customer" ? this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSupportTicketComment.uuid, "read" ) : this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSupportTicketComment.uuid, "all" ) )(),
            this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteSupportTicketComment.uuid, "read" ),
            this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteSupportTicketComment.uuid, "edit" )
        ] );
        return sportSiteSupportTicketComment;
    }

    async editById( sportSiteSupportTicketCommentUUID, sportSiteSupportTicketCommentObj ) {
        const sportSiteSupportTicketComment = await this.getById( sportSiteSupportTicketCommentUUID );
        const sportSiteSupportTicket = await this.sportSiteSupportTicketService.getById( sportSiteSupportTicketComment.ownerResourceUUID );

        if ( sportSiteSupportTicket.status === "بسته شده" && sportSiteSupportTicketCommentObj.userType !== "provider" ) {
            return this.errorUtil.throwClientError( "امکان ویرایش وجود ندارد", 400 );
        }
        await sportSiteSupportTicketComment.update( sportSiteSupportTicketCommentObj );
    }

    async getById( sportSiteSupportTicketCommentUUID ) {
        const sportSiteSupportTicketComment = await this.supportTicketCommentService.getById( sportSiteSupportTicketCommentUUID );

        if ( sportSiteSupportTicketComment.ownerResourceType !== "SportSiteSupportTicket" ) {
            return this.errorUtil.throwClientError( "چنین کامنت تیکتی برای این سایت ورزشی ثبت نشده است", 404 );
        }
        return sportSiteSupportTicketComment;
    }

    async getAllForSupportTicket( sportSiteSupportTicketUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        return await this.supportTicketCommentService.getAllForSupportTicket( sportSiteSupportTicketUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }
}

module.exports = Logics;
