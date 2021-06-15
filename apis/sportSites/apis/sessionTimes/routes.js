const { sportSiteSessionTimeForAddSchema, sportSiteSessionTimeForGetSchema, sportSiteSessionTime_sportSiteSessionForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteSessionTimeForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.addSportSiteSessionTimeHandler );
   
    fastify.get( "/:sportSiteSessionTimeUUID", {
        "schema": sportSiteSessionTimeForGetSchema
    }, httpHandlers.getSportSiteSessionTimeHandler );

    fastify.get( "/:sportSiteSessionTimeUUID/sessions", {
        "schema": sportSiteSessionTime_sportSiteSessionForGetAllSchema
    }, httpHandlers.getAllSportSiteSessionsForSportSiteSessionTimeHandler );
};
