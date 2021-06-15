const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.dateUtil, fastify.sportSiteService, fastify.sportSiteReserveService, fastify.sportSiteSessionService, fastify.sportSiteSessionTimeService, fastify.walletService, fastify.walletTransactionService );
        
        fastify.decorate( "sportSiteReserveItemService", logics );
    }
);

