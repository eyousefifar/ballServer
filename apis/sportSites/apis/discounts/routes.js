const { sportSiteDiscountForAddSchema, sportSiteDiscountForEditSchema, sportSiteDiscountForGetSchema, sportSiteDiscountForValidateAndGetByCodeSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteDiscountForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.addSportSiteDiscountHandler );

    fastify.put( "/:sportSiteDiscountUUID",
        {
            "schema": sportSiteDiscountForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteDiscountUUID )
            ]
        }, httpHandlers.editSportSiteDiscountHandler );

    fastify.get( "/:sportSiteDiscountUUID", {
        "schema": sportSiteDiscountForGetSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteDiscountUUID )
        ]
    }, httpHandlers.getSportSiteDiscountHandler );

    fastify.post( "/sportSiteDiscountCode/:sportSiteDiscountCode/validate", {
        "schema": sportSiteDiscountForValidateAndGetByCodeSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer", "provider" ] )
        ]
    }, httpHandlers.getAndvalidateSportSiteDiscountByCodeHandler );
};
