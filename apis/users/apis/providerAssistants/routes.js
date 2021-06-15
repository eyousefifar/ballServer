const { providerAssistantForAddSchema, providerAssistant_providerAssistantForEditForSchema, providerAssistantForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": providerAssistantForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addProviderAssistantHandler );

    fastify.get( "/providerAssistantUUID",
        {
            "schema": providerAssistantForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "providerAssistant" ] )
            ]
        }, httpHandlers.getProviderAssistantHandler );

    fastify.put( "/:providerAssistantUUID/userRole/providerAssistant",
        {
            "schema": providerAssistant_providerAssistantForEditForSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "ProviderAssistant" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.providerAssistantUUID )
            ]
        }, httpHandlers.editProviderAssistantForProviderAssistantHandler );
};
