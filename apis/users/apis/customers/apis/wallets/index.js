const
    fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    // apis
    transactions = require( "./apis/transactions" );

module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    // register apis
    fastify.register( transactions, { "prefix": "/transactions" } );
};

