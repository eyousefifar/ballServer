const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    supportTicketComment = require( "./services/supportTicketComment" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.resourceAuthorizeUtil, fastify.sportSiteService, fastify.supportTicketService );
    
        fastify.decorate( "sportSiteSupportTicketService", logics );
        // register services
        fastify.register( supportTicketComment );
    }
);

