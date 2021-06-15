const { sportSiteSupportTicketCommentForAddSchema, sportSiteSupportTicketCommentForEditSchema, sportSiteSupportTicketCommentForGet } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteSupportTicketCommentForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteSupportTicketUUID )
            ]
        }, httpHandlers.addSportSiteSupportTicketCommentHandler );

    fastify.put( "/:sportSiteSupportTicketCommentUUID",
        {
            "schema": sportSiteSupportTicketCommentForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSupportTicketCommentUUID )
            ]
        }, httpHandlers.editSportSiteSupportTicketCommentHandler );

    fastify.get( "/:sportSiteSupportTicketCommentUUID",
        {
            "schema": sportSiteSupportTicketCommentForGet,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSupportTicketCommentUUID )
            ]
        }, httpHandlers.getSportSiteSupportTicketCommentHandler );
};
