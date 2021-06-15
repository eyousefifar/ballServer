const { providerForAddSchema, providerForEditSchema, provider_providerSportSiteForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": providerForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addProviderHandler );

    fastify.get( "/",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.getProviderHandler );

    fastify.put( "/",
        {
            "schema": providerForEditSchema,
            "preHandler": [ fastify.authenticate( fastify.tokenUtil ), fastify.authorizeByRoles( [ "provider" ] ) ]
        }, httpHandlers.editProviderHandler );
    
    fastify.get( "/sportSites",
        {
            "schema": provider_providerSportSiteForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.getAllSportSitesForProviderHandler );
};
