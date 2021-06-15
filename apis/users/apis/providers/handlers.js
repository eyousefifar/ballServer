const { "maxPageSize": sportSiteMaxPage } = require( "../../../../services/sportSite/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addProviderHandler": async( req, reply ) => {
            const providerObj = req.body;
            const provider = await fastify.providerService.add( providerObj );
    
            reply.status( 201 ).send( provider );
        },
        "editProviderHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const providerObj = req.body;

            await fastify.providerService.editById( userUUID, providerObj );
            reply.status( 200 ).send();
        },
        "getProviderHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const provider = await fastify.providerService.getById( userUUID );

            reply.status( 200 ).send( provider );
        },
        "getAllSportSitesForProviderHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber = 1, pageSize = sportSiteMaxPage, odataStr } = req.query;
            const sportSites = await fastify.sportSiteService.getAllForUser( userUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( sportSites );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
