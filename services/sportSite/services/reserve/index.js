const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    reserveItem = require( "./services/reserveItem" );

module.exports = fastifyPlugin(
    
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.paymentUtil,
            fastify.resourceAuthorizeUtil, fastify.userService, fastify.customerCreditService, fastify.sportSiteService,
            fastify.sportSiteSessionService, fastify.sportSiteSessionTimeService, fastify.sportSiteDiscountService,
            fastify.paymentService, fastify.walletService, fastify.walletTransactionService, fastify.notificationService );
        
        fastify.decorate( "sportSiteReserveService", logics );
        // register services
        fastify.register( reserveItem );
    }
);

