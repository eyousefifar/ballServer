module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteLikeHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { sportSiteUUID } = req.body;
            const sportSiteLike = await fastify.sportSiteLikeService.add( userUUID, { sportSiteUUID } );

            reply.status( 201 ).send( sportSiteLike );
        },
        "getSportSiteLikeHandler": async( req, reply ) => {
            const { sportSiteLikeUUID } = req.params;
            const result = await fastify.sportSiteLikeService.getById( sportSiteLikeUUID );

            reply.status( 200 ).send( result );
        },
        "deleteSportSiteLikeHandler": async( req, reply ) => {
            const { sportSiteLikeUUID } = req.params;
           
            await fastify.sportSiteLikeService.removeById( sportSiteLikeUUID );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
