const { sportSiteWalletForGetSchema, sportSiteWallet_sportSiteWalletTransactionForGetAllSchema,
    sportSiteWallet_sportSiteWalletTransactionIncAndDecAmountForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/:sportSiteWalletUUID",
        {
            "schema": sportSiteWalletForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.getSportSiteWalletHandler );

    fastify.get( "/:sportSiteWalletUUID/transactions",
        {
            "schema": sportSiteWallet_sportSiteWalletTransactionForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.getAllSportSiteWalletTransactionsForSportSiteWalletHandler );

    fastify.get( "/:sportSiteWalletUUID/inc-dec/sum",
        {
            "schema": sportSiteWallet_sportSiteWalletTransactionIncAndDecAmountForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.getSportSiteWalletSumIncAndDecAmountHandler );
};
