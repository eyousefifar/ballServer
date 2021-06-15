const { sportSiteHdateForAddSchema, sportSiteHdateForGetSchema, sportSiteHdateForEditSchema, sportSiteHdateForRemoveSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteHdateForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.addSportSiteHdateHandler );

    fastify.put( "/:sportSiteHdateUUID",
        {
            "schema": sportSiteHdateForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.editSportSiteHdateHandler );

    fastify.get( "/:sportSiteHdateUUID",
        {
            "schema": sportSiteHdateForGetSchema
        }, httpHandlers.getSportSiteHdateHandler );

    fastify.delete( "/:sportSiteHdateUUID",
        {
            "schema": sportSiteHdateForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteHdateUUID )
            ]
        }, httpHandlers.removeSportSiteHdateHandler );
};
