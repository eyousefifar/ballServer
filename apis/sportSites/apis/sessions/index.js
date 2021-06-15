const fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    // apis
    discounts = require( "./apis/discounts" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    // register apis
    fastify.register( discounts, { "prefix": "/discounts" } );
};

