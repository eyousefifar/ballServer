const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" ),
    // services
    supportTicketComment = require( "./services/supportTicketComment" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.sequelizeOdataUtil, fastify.resourceAuthorizeUtil, fastify.sportSiteService );
    
        fastify.decorate( "supportTicketService", logics );
        // register services
        fastify.register( supportTicketComment );
    }
);

