const fastifyPlugin = require( "fastify-plugin" ),
    ioredis = require( "ioredis" );

const plugin = async( fastify, opts ) => {
    const redisDbClient = new ioredis( {
        "host": opts.host,
        "port": opts.port,
        "password": opts.password
    } );

    fastify.decorate( "redisDbClient", redisDbClient );
};

module.exports = fastifyPlugin( plugin, { "name": "redisDbClient" } );
