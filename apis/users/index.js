const
    fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    // apis
    providers = require( "./apis/providers" ),
    providerAssistants = require( "./apis/providerAssistants" ),
    customers = require( "./apis/customers" ),
    media = require( "./apis/media" ),
    device = require( "./apis/device" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    // register apis
    fastify.register( providers, { "prefix": "/providers" } );
    fastify.register( providerAssistants, { "prefix": "/providerAssistants" } );
    fastify.register( customers, { "prefix": "/customers" } );
    fastify.register( media, { "prefix": "/media" } );
    fastify.register( device, { "prefix": "/devices" } );
};

