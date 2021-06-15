const { userWalletTransactionForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/:userWalletTransactionUUID",
        {
            "schema": userWalletTransactionForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.userWalletTransactionUUID )
            ]
        }, httpHandlers.getUserWalletTransactionHandler );
};
