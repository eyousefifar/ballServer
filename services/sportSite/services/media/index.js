const fastifyPlugin = require( "fastify-plugin" ),
    Logics = require( "./logics" );

module.exports = fastifyPlugin(
    async( fastify, opts ) => {
        const logics = new Logics( fastify.dbClient, fastify.errorUtil, fastify.sequelizeCachingUtil, fastify.resourceAuthorizeUtil, fastify.mediaService, fastify.sportSiteService );

        fastify.decorate( "sportSiteMediaService", logics );
    }
);
