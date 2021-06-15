module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/:share/link",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.createShareLinkHandler );
};
