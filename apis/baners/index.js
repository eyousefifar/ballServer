const fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    // apis
    mediaApi = require( "./apis/media" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    fastify.register( mediaApi, { "prefix": "/media" } );
};

