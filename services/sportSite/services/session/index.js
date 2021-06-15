const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    discount = require( "./services/discount" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.resourceAuthorizeUtil, fastify.sportSiteService, fastify.sportSiteSessionTimeService, fastify.sportSiteHdateService );

        fastify.decorate( "sportSiteSessionService", logics );
        fastify.register( discount );
    }
);

