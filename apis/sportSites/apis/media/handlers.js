module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteMediaHandler": async( req, reply ) => {
            const sportSiteMediaObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteMedia = await fastify.sportSiteMediaService.add( userUUID, sportSiteMediaObj );

            reply.status( 201 ).send( sportSiteMedia );
        },
        "removeSportSiteMediaHandler": async( req, reply ) => {
            const { sportSiteMediaUUID } = req.params;
    
            await fastify.sportSiteMediaService.removeById( sportSiteMediaUUID );
            reply.status( 200 ).send();
        },
        "editSportSiteMediaHandler": async( req, reply ) => {
            const { sportSiteMediaUUID } = req.params;
            const sportSiteMediaObj = req.body;

            await fastify.sportSiteMediaService.editById( sportSiteMediaUUID, sportSiteMediaObj );
            reply.status( 200 ).send();
        },
        "getSportSiteMediaHandler": async( req, reply ) => {
            const { sportSiteMediaUUID } = req.params;
            const result = await fastify.sportSiteMediaService.getById( sportSiteMediaUUID );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
