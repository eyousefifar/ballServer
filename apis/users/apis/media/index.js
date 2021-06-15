const
    setupMultipartFormDataSupport = require( "../../../../core/plugins/setupMultipartFormDataSupport" ),
    fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" );

module.exports = async function( fastify, opts ) {
    fastify.register( setupMultipartFormDataSupport );
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
};

