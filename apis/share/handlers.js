module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "createShareLinkHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const shareLink = await fastify.shareService.createLink( userUUID );

            reply.status( 200 ).send( shareLink );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
