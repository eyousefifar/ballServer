// services
const
    fastifyPlugin = require( "fastify-plugin" ),
    userService = require( "./user" ),
    mediaService = require( "./media" ),
    likeService = require( "./like" ),
    rateService = require( "./rate" ),
    commentService = require( "./comment" ),
    paymentService = require( "./payment" ),
    discountService = require( "./discount" ),
    walletService = require( "./wallet" ),
    addressService = require( "./address" ),
    supportTicketService = require( "./supportTicket" ),
    authService = require( "./auth" ),
    sportSiteService = require( "./sportSite" ),
    bannerService = require( "./baner" ),
    homeService = require( "./home" ),
    notificationService = require( "./notification" ),
    sessionManagerService = require( "./sessionManager" );

module.exports = fastifyPlugin(
    async( fastify ) => {
        fastify.register( paymentService );

        fastify.register( mediaService );

        fastify.register( addressService );

        fastify.register( commentService );

        fastify.register( supportTicketService );

        fastify.register( walletService );

        fastify.register( likeService );

        fastify.register( rateService );

        fastify.register( discountService );

        fastify.register( userService );

        fastify.register( notificationService );

        fastify.register( authService );

        fastify.register( sportSiteService );

        fastify.register( bannerService );

        fastify.register( homeService );

        fastify.register( sessionManagerService );

        fastify.setErrorHandler( ( err, req, reply ) => {
            const { logManagerUtil } = fastify.logManagerUtil;

            fastify.errorUtil.handleError( err, req, reply );
            logManagerUtil.logError( err, req, reply );
        } );
    }
);
