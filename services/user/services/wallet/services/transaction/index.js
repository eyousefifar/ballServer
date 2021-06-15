const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.paymentUtil, fastify.userService, fastify.userWalletService, fastify.walletTransactionService, fastify.paymentService );

        fastify.decorate( "userWalletTransactionService", logics );
    }
);

