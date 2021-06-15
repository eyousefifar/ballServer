const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    setup = require( "./setup" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        setup( fastify.jobManagerUtil, fastify.notificationUtil );
        const logics = new Logics( fastify.dbClient, fastify.redisDbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.jobManagerUtil, fastify.userDeviceService );

        fastify.decorate( "notificationService", logics );
    }
);

