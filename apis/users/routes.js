const { userForAddSchema_admin, userForEditSchema_admin } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/", {
        "schema": userForAddSchema_admin,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "admin" ] )
        ]
    }, httpHandlers.addUserHandler );

    fastify.put( "/:userUUID",
        {
            "schema": userForEditSchema_admin,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.editUserHandler );

    fastify.get( "/:userUUID", {
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "admin" ] )
        ]
    }, httpHandlers.getUserHandler );

    fastify.get( "/", {
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider", "customer" ] )
        ]
    }, httpHandlers.getUserByTokenHandler );

    fastify.get( "/notifications", {
        "preHandler": fastify.authenticate( fastify.tokenUtil )
    }, httpHandlers.getAllNotificationsForOwnerUserHandler );
};
