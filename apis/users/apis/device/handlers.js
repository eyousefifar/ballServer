module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addUserDeviceHandler": async( req, reply ) => {
            const userDeviceObj = req.body;
            const userDevice = await fastify.userDeviceService.add( userDeviceObj );
    
            reply.status( 201 ).send( userDevice );
        },
        "editUserDeviceHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const userDeviceObj = req.body;

            await fastify.userDeviceService.editById( userUUID, userDeviceObj );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
