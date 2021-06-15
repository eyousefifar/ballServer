module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addProviderAssistantHandler": async( req, reply ) => {
            const providerAssistantObj = req.body;
            const userUUID = req.user.uuid;
            const providerAssistant = await fastify.providerAssistantService.add( userUUID, providerAssistantObj );
            
            reply.status( 201 ).send( providerAssistant );
        },
        "editProviderAssistantForProviderAssistantHandler": async( req, reply ) => {
            const { providerAssistantUUID } = req.params;
            const providerAssistantObj = req.body;
            const result = await fastify.providerAssistantService.editById( providerAssistantUUID, providerAssistantObj );
    
            reply.status( 201 ).send( result );
        },
        "getProviderAssistantHandler": async( req, reply ) => {
            const providerAssistantUUID = req.user.uuid;

            await fastify.providerAssistantService.getById( providerAssistantUUID );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
