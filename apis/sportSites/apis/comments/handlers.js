module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteCommentHandler": async( req, reply ) => {
            const sportSiteCommentObj = req.body;
            const userUUID = req.user.uuid;
            const userType = req.user.role;
            const sportSiteComment = await fastify.sportSiteCommentService.add( userType, userUUID, sportSiteCommentObj );

            reply.status( 201 ).send( sportSiteComment );
        },
        "editSportSiteCommentHandler": async( req, reply ) => {
            const { sportSiteCommentUUID } = req.params;
            const sportSiteCommentObj = req.body;

            await fastify.sportSiteCommentService.editById( sportSiteCommentUUID, sportSiteCommentObj );
            reply.status( 200 ).send();
        },
        "removeSportSiteCommentHandler": async( req, reply ) => {
            const { sportSiteCommentUUID } = req.params;

            await fastify.sportSiteCommentService.removeById( sportSiteCommentUUID );
            reply.status( 200 ).send();
        },
        "getSportSiteCommentHandler": async( req, reply ) => {
            const { sportSiteCommentUUID } = req.params;
            const sportSiteComment = await fastify.sportSiteCommentService.getById( sportSiteCommentUUID );

            reply.status( 200 ).send( sportSiteComment );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
