module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "editReserveItemHandler": async( req, reply ) => {
            const { sportSiteReserveItemUUID } = req.params;
            const { sportSiteReserveItemObj } = req.body;
            const result = await fastify.sportSiteReserveItemService.editById( sportSiteReserveItemUUID, sportSiteReserveItemObj );
    
            reply.status( 200 ).send( result );
        },
        "editReserveItemByCodeHandler": async( req, reply ) => {
            const { code } = req.params;
            const { sportSiteReserveItemObj } = req.body;
            const result = await fastify.sportSiteReserveItemService.editByCode( code, sportSiteReserveItemObj );
    
            reply.status( 200 ).send( result );
        },
        "removeSportSiteReserveItemHandler": async( req, reply ) => {
            const { sportSiteReserveItemUUID } = req.params;

            await fastify.sportSiteReserveItemService.removeById( sportSiteReserveItemUUID );
            reply.status( 200 ).send();
        },
        "checkReserveItemHandler": async( req, reply ) => {
            const { sportSiteReserveItemUUID } = req.params;
            const result = await fastify.sportSiteReserveItemService.checkById( sportSiteReserveItemUUID );
    
            reply.status( 200 ).send( result );
        },
        "checkReserveItemByCodeHandler": async( req, reply ) => {
            const { code } = req.params;
            const result = await fastify.sportSiteReserveItemService.checkByCode( code );
    
            reply.status( 200 ).send( result );
        },
        "getReserveItemHandler": async( req, reply ) => {
            const { sportSiteReserveItemUUID } = req.params;
            const result = await fastify.sportSiteReserveItemService.getById( sportSiteReserveItemUUID );
    
            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
