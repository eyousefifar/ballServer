module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteRateHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { sportSiteRateObj, sportSiteRateItemObjs } = req.body;
            const sportSiteRate = await fastify.sportSiteRateService.add( userUUID, sportSiteRateObj, sportSiteRateItemObjs );

            reply.status( 201 ).send( sportSiteRate );
        },
        "getSportSiteRateHandler": async( req, reply ) => {
            const { sportSiteRateUUID } = req.params;
            const result = await fastify.sportSiteRateService.getById( sportSiteRateUUID );

            reply.status( 200 ).send( result );
        },
        "editSportSiteRateHandler": async( req, reply ) => {
            const { sportSiteRateUUID } = req.params;
            const { sportSiteRateObj, sportSiteRateItemObjs } = req.body;

            await fastify.sportSiteRateService.editById( sportSiteRateUUID, sportSiteRateObj, sportSiteRateItemObjs );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
