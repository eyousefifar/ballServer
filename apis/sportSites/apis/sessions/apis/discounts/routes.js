const { sportSiteSessionDiscountForAddSchema, sportSiteSessionDiscountForEditSchema, sportSiteSessionDiscountForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteSessionDiscountForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteSessionUUID )
            ]
        }, httpHandlers.addSportSiteSessionDiscountHandler );

    fastify.put( "/:sportSiteSessionDiscountUUID",
        {
            "schema": sportSiteSessionDiscountForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteSessionDiscountUUID )
            ]
        }, httpHandlers.editSportSiteSessionDiscountHandler );

    fastify.get( "/:sportSiteSessionDiscountUUID", {
        "schema": sportSiteSessionDiscountForGetSchema
    }, httpHandlers.getSportSiteSessionDiscountHandler );
};
