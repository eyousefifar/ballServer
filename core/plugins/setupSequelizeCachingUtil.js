const fastifyPlugin = require( "fastify-plugin" ),
    RedisAdaptor = require( "sequelize-transparent-cache-ioredis" ),
    sequelizeCache = require( "sequelize-transparent-cache" );


const plugin = async( fastify, opts ) => {
    const redisAdaptor = new RedisAdaptor( {
        "client": fastify.redisDbClient,
        "lifetime": opts.ttl
    } );
    const sequelizeCachingUtil = sequelizeCache( redisAdaptor );
    
    fastify.decorate( "sequelizeCachingUtil", sequelizeCachingUtil );
};

module.exports = fastifyPlugin( plugin, { "dependencies": [ "redisDbClient" ] } );

