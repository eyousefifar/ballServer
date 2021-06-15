class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, commentService, sportSiteService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.commentService = commentService;
        this.sportSiteService = sportSiteService;
    }

    async add( userType, userUUID, sportSiteCommentObj ) {
        sportSiteCommentObj.userUUID = userUUID;
        sportSiteCommentObj.userType = userType;
        sportSiteCommentObj.ownerResourceUUID = sportSiteCommentObj.sportSiteUUID;
        sportSiteCommentObj.ownerResourceType = "SportSite";
        const sportSite = await this.sportSiteService.getById( sportSiteCommentObj.sportSiteUUID );
        const sportSiteComment = await this.commentService.add( sportSiteCommentObj );

        await Promise.all( [
            this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteComment.uuid, "all" ),
            this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteComment.uuid, "edit" )
        ] );
        return sportSiteComment;
    }

    async editById( sportSiteCommentUUID, sportSiteCommentObj ) {
        const sportSiteComment = await this.getById( sportSiteCommentUUID );

        if ( sportSiteComment.confirmStatus ) {
            sportSiteCommentObj.confirmStatus = false;
        }
        await sportSiteComment.update( sportSiteCommentObj );
    }

    async removeById( sportSiteCommentUUID ) {
        const sportSiteComment = await this.getById( sportSiteCommentUUID );

        await sportSiteComment.destroy( sportSiteCommentObj );
    }

    async getById( sportSiteCommentUUID ) {
        const sportSiteComment = await this.commentService.getById( sportSiteCommentUUID );

        if ( sportSiteComment.ownerResourceType !== "SportSiteRate" ) {
            return this.errorUtil.throwClientError( "چنین نظری برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return sportSiteComment;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getUser = true, userOdataStr = null } = {} ) {
        return await this.commentService.getAllForOwnerResource( sportSiteUUID, { pageNumber, pageSize, odataStr, queryObj, confirmStatus, getUser, userOdataStr } );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getSportSite = true, sportSiteOdataStr = null } = {} ) {
        return await this.commentService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, queryObj, confirmStatus, getSportSite, sportSiteOdataStr } );
    }

    async getAllForComment( replyCommentUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getUser = true, userOdataStr = null, getSportSite = true, sportSiteOdataStr = null } = {} ) {
        return await this.commentService.getAllForComment( replyCommentUUID, { pageNumber, pageSize, odataStr, queryObj, confirmStatus, getUser, userOdataStr, getSportSite, sportSiteOdataStr } );
    }
}

module.exports = Logics;
