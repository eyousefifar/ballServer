module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteSupportTicketCommentHandler": async( req, reply ) => {
            const sportSiteSupportTicketCommentObj = req.body;
            const userUUID = req.user.uuid;
            const userType = req.user.role;
            const sportSiteSupportTicketComment = await fastify.sportSiteSupportTicketCommentService.add( userType, userUUID, sportSiteSupportTicketCommentObj );
            
            reply.status( 201 ).send( sportSiteSupportTicketComment );
        },
        "editSportSiteSupportTicketCommentHandler": async( req, reply ) => {
            const { sportSiteSupportTicketCommentUUID } = req.params;
            const sportSiteSupportTicketCommentObj = req.body;
            const userUUID = req.user.uuid;
            const userType = req.user.role;

            sportSiteSupportTicketCommentObj.userUUID = userUUID;
            sportSiteSupportTicketCommentObj.userType = userType;
            await fastify.sportSiteSupportTicketCommentService.editById( sportSiteSupportTicketCommentUUID, sportSiteSupportTicketCommentObj );
            reply.status( 200 ).send( );
        },
        "getSportSiteSupportTicketCommentHandler": async( req, reply ) => {
            const { sportSiteSupportTicketCommentUUID } = req.params;
            const result = await fastify.sportSiteSupportTicketCommentService.getById( sportSiteSupportTicketCommentUUID );

            reply.status( 200 ).send( result );
        },
        "getSportSiteSupportTicketCommentsForSportSiteSupportTicketHandler": async( req, reply ) => {
            const { sportSiteSupportTicketUUID } = req.params;
            const result = await fastify.sportSiteSupportTicketCommentService.getAllForSupportTicket( sportSiteSupportTicketUUID );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
