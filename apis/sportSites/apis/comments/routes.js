const { sportSiteCommentForAddSchema, sportSiteCommentForEditSchema, sportSiteCommentForRemoveSchema, sportSiteCommentForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteCommentForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "admin" ] )
            ]
        }, httpHandlers.addSportSiteCommentHandler );

    fastify.put( "/:sportSiteCommentUUID",
        {
            "schema": sportSiteCommentForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "admin" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteCommentUUID )
            ]
        }, httpHandlers.editSportSiteCommentHandler );

    fastify.delete( "/:sportSiteCommentUUID",
        {
            "schema": sportSiteCommentForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "admin" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteCommentUUID )
            ]
        }, httpHandlers.removeSportSiteCommentHandler );

    fastify.get( "/:sportSiteCommentUUID",
        {
            "schema": sportSiteCommentForGetSchema
        }, httpHandlers.getSportSiteCommentHandler );
};
