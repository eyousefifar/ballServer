const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    transaction = require( "./services/transaction" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.walletService );

        fastify.decorate( "userWalletService", logics );
        // register services
        fastify.register( transaction );
    }
);
