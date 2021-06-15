const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    transaction = require( "./services/transaction" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.walletTransactionService );

        fastify.decorate( "walletService", logics );
        // register services
        fastify.register( transaction );
    }
);
