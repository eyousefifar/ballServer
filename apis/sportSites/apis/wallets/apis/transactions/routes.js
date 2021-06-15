const { sportSiteWalletTransactionForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/:sportSiteWalletTransactionUUID",
        {
            "schema": sportSiteWalletTransactionForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteWalletTransactionUUID )
            ]
        }, httpHandlers.getSportSiteWalletTransactionHandler );
};
