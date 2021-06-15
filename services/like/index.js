const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.redisDbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil );

        fastify.decorate( "likeService", logics );
    }
);

