const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    setup = require( "./setup" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        setup( fastify.jobManagerUtil, fastify.smsUtil, fastify.emailUtil );
        const logics = new Logics( fastify.dbClient, fastify.redisDbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.tokenUtil, fastify.resourceAuthorizeUtil, fastify.jobManagerUtil, fastify.userService, fastify.customerService, fastify.providerService, fastify.providerAssistantService, fastify.userDeviceService );

        fastify.decorate( "authService", logics );
    }
);

