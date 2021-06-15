const
    fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    wallets = require( "./apis/wallets" ),
    credits = require( "./apis/credits" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    fastify.register( wallets, { "prefix": "/wallets" } );
    fastify.register( credits, { "prefix": "/credits" } );
};

