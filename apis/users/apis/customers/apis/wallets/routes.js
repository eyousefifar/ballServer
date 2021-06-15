const { userWalletForAddAmount, userWalletAmountPaymentCallback, userWallet_userWalletTransactionForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getUserWalletHandler );

    fastify.get( "/:userWalletUUID/transactions",
        {
            "schema": userWallet_userWalletTransactionForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getAllUserWalletTransactionsForUserWalletHandler );

    fastify.post( "/amount/request",
        {
            "schema": userWalletForAddAmount,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.submitAddAmountRequestHandler );

    fastify.get( "/amount/callback",
        {
            "schema": userWalletAmountPaymentCallback
        }, httpHandlers.verifyAddAmountRequestHandler );
};
