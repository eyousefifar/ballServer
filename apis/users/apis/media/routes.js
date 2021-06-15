const { userProfilePicForAdd } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;
    
    fastify.post( "/",
        {
            "schema": userProfilePicForAdd,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] )
            ]
        }, httpHandlers.addProfilePicHandler );

    fastify.delete( "/",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer", "provider" ] )
            ]
        }, httpHandlers.deleteProfilePicHandler );
};
