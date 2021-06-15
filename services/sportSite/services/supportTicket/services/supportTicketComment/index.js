const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.resourceAuthorizeUtil, fastify.sportSiteService, fastify.supportTicketCommentService, fastify.sportSiteSupportTicketService );
    
        fastify.decorate( "sportSiteSupportTicketCommentService", logics );
    }
);

