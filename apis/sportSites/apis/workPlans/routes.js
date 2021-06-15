const { sportSiteWorkPlanForAddSchema, sportSiteWorkPlanForEditSchema, sportSiteWorkPlanForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteWorkPlanForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.addSportSiteWorkPlanHandler );

    fastify.put( "/:sportSiteWorkPlanUUID",
        {
            "schema": sportSiteWorkPlanForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteWorkPlanUUID )
            ]
        }, httpHandlers.editSportSiteWorkPlanHandler );

    fastify.get( "/:sportSiteWorkPlanUUID", {
        "schema": sportSiteWorkPlanForGetSchema
    }, httpHandlers.getSportSiteWorkPlanHandler );
};
