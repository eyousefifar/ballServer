const { sportSiteLikeForAddSchema, sportSiteLikeForGetSchema, sportSiteLikeForRemoveSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteLikeForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.addSportSiteLikeHandler );

    fastify.delete( "/:sportSiteLikeUUID",
        {
            "schema": sportSiteLikeForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteLikeUUID )
            ]
        }, httpHandlers.deleteSportSiteLikeHandler );

    fastify.get( "/:sportSiteLikeUUID",
        {
            "schema": sportSiteLikeForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteLikeUUID )
            ]
        }, httpHandlers.getSportSiteLikeHandler );
};
