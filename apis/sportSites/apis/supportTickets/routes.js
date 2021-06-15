const { sportSiteSupportTicketForAddSchema, sportSiteSupportTicket_sportSiteSupportTicketCommentForGetAllSchema, sportSiteSupportTicketForGet } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteSupportTicketForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.addSportSiteSupportTicketHandler );

    fastify.get( "/:sportSiteSupportTicketUUID",
        {
            "schema": sportSiteSupportTicketForGet,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSupportTicketUUID )
            ]
        }, httpHandlers.getSportSiteSupportTicketHandler );

    fastify.get( "/:sportSiteSupportTicketUUID/comments",
        {
            "schema": sportSiteSupportTicket_sportSiteSupportTicketCommentForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSupportTicketUUID )
            ]
        }, httpHandlers.getSportSiteSupportTicketCommentsForSportSiteSupportTicketHandler );
};
