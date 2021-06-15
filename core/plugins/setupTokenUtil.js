const fastifyPlugin = require( "fastify-plugin" ),
    TokenUtil = require( "../libs/tokenUtil" );
const plugin = async( fastify, opts ) => {
    const tokenUtil = new TokenUtil( fastify.jwt, fastify.redisDbClient, opts.jwtSecretKey );

    fastify.decorate( "tokenUtil", tokenUtil );
};

module.exports = fastifyPlugin( plugin );
