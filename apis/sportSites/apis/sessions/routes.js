const { sportSiteSessionForAddSchema, sportSiteSessionForEditSchema, sportSiteSessionForGetSchema, sportSiteSession_reserveItemForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteSessionForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sessionTimeUUID )
            ]
        }, httpHandlers.addSportSiteSessionHandler );

    fastify.put( "/:sportSiteSessionUUID",
        {
            "schema": sportSiteSessionForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSessionUUID )
            ]
        }, httpHandlers.editSportSiteSessionHandler );

    fastify.get( "/:sportSiteSessionUUID", {
        "schema": sportSiteSessionForGetSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider", "customer" ] )
        ]
    }, httpHandlers.getSportSiteSessionHandler );

    fastify.get( "/:sportSiteSessionUUID/reserveItems", {
        "schema": sportSiteSession_reserveItemForGetAllSchema,
       
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSessionUUID )
        ]
    }, httpHandlers.getAllReserveItemsForSportSiteSessionHandler );
};
