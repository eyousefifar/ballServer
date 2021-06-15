module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteSessionTimeHandler": async( req, reply ) => {
            const sportSiteSessionTimeObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteSessionTime = await fastify.sportSiteSessionTimeService.add( userUUID, sportSiteSessionTimeObj );

            reply.status( 201 ).send( sportSiteSessionTime );
        },
        "editSportSiteSessionTimeHandler": async( req, reply ) => {
            const sportSiteSessionTimeObj = req.body;
            const { sportSiteSessionTimeUUID } = req.params;
            const sportSiteSessionTime = await fastify.sportSiteSessionTimeService.editById( sportSiteSessionTimeUUID, sportSiteSessionTimeObj );

            reply.status( 201 ).send( sportSiteSessionTime );
        },
        "getSportSiteSessionTimeHandler": async( req, reply ) => {
            const { sportSiteSessionTimeUUID } = req.params;
            const sportSiteSessionTime = await fastify.sportSiteSessionTimeService.getById( sportSiteSessionTimeUUID );

            reply.status( 200 ).send( sportSiteSessionTime );
        },
        "getAllSportSiteSessionsForSportSiteSessionTimeHandler": async( req, reply ) => {
            const { sportSiteSessionTimeUUID } = req.params;

            await fastify.sportSiteSessionService.getAllForSportSiteSessionTime( sportSiteSessionTimeUUID );
            reply.status( 200 ).send();
        }
    };
 
    fastify.decorate( "httpHandlers", httpHandlers );
};
