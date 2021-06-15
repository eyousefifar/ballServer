const fastifyPlugin = require( "fastify-plugin" ),
    { Graph } = require( "redisgraph.js" );

const plugin = async( fastify, opts ) => {
    const graph = new Graph( "ResourceOwner" );

    fastify.decorate( "redisGraphDbClient", qraph );
};

module.exports = fastifyPlugin( plugin, { "name": "redisGraphDbClient" } );
