const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // service
    rateItem = require( "./services/rateItem" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil );

        fastify.decorate( "rateService", logics );
        // register services
        fastify.register( rateItem );
    }
);

