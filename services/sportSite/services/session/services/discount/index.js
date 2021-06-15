const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sportSiteService, fastify.sportSiteSessionService, fastify.sportSiteSessionTimeService, fastify.discountService );

        fastify.decorate( "sportSiteSessionDiscountService", logics );
    }
);

