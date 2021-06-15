const fastifyPlugin = require( "fastify-plugin" ),
    ApiCachingUtil = require( "../libs/apiCachingUtil" );

const plugin = async( fastify, opts ) => {
    const apiCachingUtil = new ApiCachingUtil( fastify.redisDbClient, opts.ttl );
    
    fastify.decorate( "apiCachingUtil", apiCachingUtil );
};

module.exports = fastifyPlugin( plugin, { "dependencies": [ "redisDbClient" ] } );
