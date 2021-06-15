const { "maxPageSize": reserveItemMaxPageSize } = require( "../../../../services/sportSite/services/session/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteSessionHandler": async( req, reply ) => {
            const sportSiteSessionObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteSession = await fastify.sportSiteSessionService.add( userUUID, sportSiteSessionObj );

            reply.status( 201 ).send( sportSiteSession );
        },
        "editSportSiteSessionHandler": async( req, reply ) => {
            const { sportSiteSessionUUID } = req.params;
            const sportSiteSessionObj = req.body;
            
            await fastify.sportSiteSessionService.editById( sportSiteSessionUUID, sportSiteSessionObj );
            reply.status( 200 ).send();
        },
        "getSportSiteSessionHandler": async( req, reply ) => {
            const { sportSiteSessionUUID } = req.params;
            const userType = req.user.role;
            const result = await fastify.sportSiteSessionService.getById( userType, sportSiteSessionUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllReserveItemsForSportSiteSessionHandler": async( req, reply ) => {
            const { sportSiteSessionUUID } = req.params;
            const { pageNumber = 1, pageSize = reserveItemMaxPageSize, odataStr } = req.query;
            const result = await fastify.sportSiteReserveItemService.getAllForSession( sportSiteSessionUUID, { pageNumber, pageSize, odataStr } );
    
            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
