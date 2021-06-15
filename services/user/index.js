const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    device = require( "./services/device" ),
    media = require( "./services/media" ),
    wallet = require( "./services/wallet" ),
    credit = require( "./services/credit" ),
    provider = require( "./services/provider" ),
    providerAssistant = require( "./services/providerAssistant" ),
    customer = require( "./services/customer" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.tokenUtil, fastify.sequelizeCachingUtil );

        fastify.decorate( "userService", logics );
        // register services
        fastify.register( device );
        fastify.register( media );
        fastify.register( wallet );
        fastify.register( credit );
        fastify.register( customer );
        fastify.register( provider );
        fastify.register( providerAssistant );
    }
);

