const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    transaction = require( "./services/transaction" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.resourceAuthorizeUtil, fastify.walletService, fastify.walletTransactionService );

        fastify.decorate( "sportSiteWalletService", logics );
        // register services
        fastify.register( transaction );
    }
);
