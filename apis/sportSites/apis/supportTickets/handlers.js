const { "maxPageSize": supportTicketCommentMaxPageSize } = require( "../../../../services/sportSite/services/supportTicket/services/supportTicketComment/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteSupportTicketHandler": async( req, reply ) => {
            const sportSiteSupportTicketObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteSupportTicket = await fastify.sportSiteSupportTicketService.add( userUUID, sportSiteSupportTicketObj );

            reply.status( 201 ).send( sportSiteSupportTicket );
        },
        "getSportSiteSupportTicketHandler": async( req, reply ) => {
            const { sportSiteSupportTicketUUID } = req.params;
            const result = await fastify.sportSiteSupportTicketService.getById( sportSiteSupportTicketUUID );

            reply.status( 200 ).send( result );
        },
        "getSportSiteSupportTicketCommentsForSportSiteSupportTicketHandler": async( req, reply ) => {
            const { sportSiteSupportTicketUUID } = req.params;
            const { pageNumber = 1, pageSize = supportTicketCommentMaxPageSize, odataStr } = req.query;
            const result = await fastify.sportSiteSupportTicketCommentService.getAllForSupportTicket( sportSiteSupportTicketUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
