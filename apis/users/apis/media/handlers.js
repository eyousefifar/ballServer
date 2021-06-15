module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addProfilePicHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const userMediaObj = req.body;
            const userMeida = await fastify.userMediaService.add( userUUID, userMediaObj );

            reply.status( 200 ).send( userMeida );
        },
        "deleteProfilePicHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;

            await fastify.userMediaService.removeById( userUUID );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
