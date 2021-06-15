const { sportSiteRateForAddSchema, sportSiteRateForGetSchema, sportSiteRateForEditSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteRateForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.addSportSiteRateHandler );

    fastify.put( "/:sportSiteRateUUID",
        {
            "schema": sportSiteRateForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteRateUUID )
            ]
        }, httpHandlers.editSportSiteRateHandler );

    fastify.get( "/:sportSiteRateUUID",
        {
            "schema": sportSiteRateForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteRateUUID )
            ]
        }, httpHandlers.getSportSiteRateHandler );
};
