const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    comment = require( "./services/comment" ),
    sessionTime = require( "./services/sessionTime" ),
    session = require( "./services/session" ),
    hdate = require( "./services/hdate" ),
    like = require( "./services/like" ),
    media = require( "./services/media" ),
    rate = require( "./services/rate" ),
    reserve = require( "./services/reserve" ),
    supportTicket = require( "./services/supportTicket" ),
    wallet = require( "./services/wallet" ),
    workPlan = require( "./services/workPlan" ),
    discount = require( "./services/discount" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.resourceAuthorizeUtil, fastify.walletService, fastify.addressService, fastify.rateService );

        fastify.decorate( "sportSiteService", logics );
        // register services
        fastify.register( comment );
        fastify.register( hdate );
        fastify.register( discount );
        fastify.register( sessionTime );
        fastify.register( session );
        fastify.register( reserve );
        fastify.register( rate );
        fastify.register( like );
        fastify.register( media );
        fastify.register( wallet );
        fastify.register( supportTicket );
        fastify.register( workPlan );
    }
);

