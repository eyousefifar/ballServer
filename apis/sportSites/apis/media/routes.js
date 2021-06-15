const { sportSiteMediaForAddSchema, sportSiteMediaForGetSchema, sportSiteMediaForEditSchema, sportSiteMediaForRemoveSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteMediaForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.body.sportSiteUUID )
            ]
        }, httpHandlers.addSportSiteMediaHandler );

    fastify.put( "/:sportSiteMediaUUID",
        {
            "schema": sportSiteMediaForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteMediaUUID )
            ]
        }, httpHandlers.editSportSiteMediaHandler );
    
    fastify.get( "/:sportSiteMediaUUID",
        {
            "schema": sportSiteMediaForGetSchema
        }, httpHandlers.getSportSiteMediaHandler );

    fastify.delete( "/:sportSiteMediaUUID",
        {
            "schema": sportSiteMediaForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteMediaUUID )
            ]
        }, httpHandlers.removeSportSiteMediaHandler );
};
