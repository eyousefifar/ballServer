module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteHdateHandler": async( req, reply ) => {
            const sportSiteHdateObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteHdate = await fastify.sportSiteHdateService.add( userUUID, sportSiteHdateObj );

            reply.status( 201 ).send( sportSiteHdate );
        },
        "removeSportSiteHdateHandler": async( req, reply ) => {
            const { sportSiteHdateUUID } = req.params;
    
            await fastify.sportSiteHdateService.removeById( sportSiteHdateUUID );
            reply.status( 200 ).send();
        },
        "editSportSiteHdateHandler": async( req, reply ) => {
            const sportSiteHdateObj = req.body;
            const { sportSiteHdateUUID } = req.params;

            await fastify.sportSiteHdateService.editById( sportSiteHdateUUID, sportSiteHdateObj );
            reply.status( 200 ).send();
        },
        "getSportSiteHdateHandler": async( req, reply ) => {
            const { sportSiteHdateUUID } = req.params;
            const result = await fastify.sportSiteHdateService.getById( sportSiteHdateUUID );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
