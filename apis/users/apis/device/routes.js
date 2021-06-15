const { userDeviceForAddSchema, userDeviceForEditSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": userDeviceForAddSchema
        }, httpHandlers.addUserDeviceHandler );

    fastify.put( "/:userDeviceUUID",
        {
            "schema": userDeviceForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.editUserDeviceHandler );
};
