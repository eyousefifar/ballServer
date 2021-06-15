class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, supportTicketService, commentService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.supportTicketService = supportTicketService;
        this.commentService = commentService;
    }

    async add( supportTicket, supportTicketCommentObj ) {
        supportTicketCommentObj.ownerResourceUUID = supportTicket.uuid;
        supportTicketCommentObj.ownerResourceType = "SupportTicket";
        if ( supportTicket.status === "بسته شده" ) {
            return this.errorUtil.throwClientError( "این تیکت بسته شده است و امکان اضافه کردن پیام در آن وجود ندارد", 400 );
        }
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            if ( supportTicketCommentObj.replyCommentUUID && supportTicketCommentObj.userType === "provider" ) {
                sportSiteSupportTicket.update( { "status": "پاسخ داده شده" } );
            }
            const supportTicketComment = await this.commentService.add( supportTicketCommentObj, { "transaction": t } );

            return supportTicketComment;
        } );
    }

    async editById( supportTicketCommentUUID, supportTicketCommentObj, { "transaction": t = null } = {} ) {
        const supportTicketComment = await this.getById( supportTicketCommentUUID );
        const supportTicket = await this.supportTicketService.getById( supportTicketComment.supportTicketUUID );

        if ( supportTicket.closeStatus && supportTicketCommentObj.userType !== "provider" ) {
            return this.errorUtil.throwClientError( "امکان ویرایش وجود ندارد", 400 );
        }
        await supportTicketComment.update( supportTicketCommentObj, { "transaction": t } );
    }

    async getById( supportTicketCommentUUID, { "transaction": t = null } = {} ) {
        const supportTicketComment = await this.commentService.getById( supportTicketCommentUUID, { "transaction": t } );

        if ( supportTicketComment.ownerResourceType !== "SupportTicket" ) {
            return this.errorUtil.throwClientError( "چنین کامنت تیکتی ثبت نشده است", 404 );
        }
        return supportTicketComment;
    }

    async getAllForSupportTicket( supportTicketUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        return await this.commentService.getAllForOwnerResource( supportTicketUUID, { pageNumber, pageSize, odataStr, queryObj, "confirmStatus": null } );
    }
}

module.exports = Logics;
