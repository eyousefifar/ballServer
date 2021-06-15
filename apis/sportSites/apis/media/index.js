const fastifyPlugin = require( "fastify-plugin" ),
    setupMultipartFormDataSupport = require( "../../../../core/plugins/setupMultipartFormDataSupport" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" );

module.exports = async function( fastify, opts ) {
    fastify.register( setupMultipartFormDataSupport );
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
};

