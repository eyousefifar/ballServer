// apis
const
    userApi = require( "./users" ),
    sportSiteApi = require( "./sportSites" ),
    authApi = require( "./auth" ),
    paymentApi = require( "./payments" ),
    utilApi = require( "./utils" ),
    homeApi = require( "./home" ),
    banerApi = require( "./baners" );

module.exports = async( fastify ) => {
    fastify.register( userApi, { "prefix": "/api/users" } );

    fastify.register( authApi, { "prefix": "/api/auth" } );

    fastify.register( sportSiteApi, { "prefix": "/api/sportSites" } );

    fastify.register( paymentApi, { "prefix": "/api/payments" } );

    fastify.register( utilApi, { "prefix": "/api/utils" } );

    fastify.register( homeApi, { "prefix": "/api/home" } );

    fastify.register( banerApi, { "prefix": "/api/baners" } );

    fastify.setErrorHandler( ( err, req, reply ) => {
        fastify.errorUtil.handleError( err, req, reply );
    } );
};
