const { "maxPageSize": sportSiteWalletTransactionMaxPage } = require( "../../../../services/sportSite/services/wallet/services/transaction/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getSportSiteWalletHandler": async( req, reply ) => {
            const { sportSiteWalletUUID } = req.params;
            const sportSiteWallet = await fastify.sportSiteWalletService.getById( sportSiteWalletUUID );

            reply.status( 200 ).send( sportSiteWallet );
        },
        "getAllSportSiteWalletTransactionsForSportSiteWalletHandler": async( req, reply ) => {
            const { sportSiteWalletUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteWalletTransactionMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteWalletTransactionService.getAllForSportSiteWallet( sportSiteWalletUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "getSportSiteWalletSumIncAndDecAmountHandler": async( req, reply ) => {
            const { sportSiteWalletUUID } = req.params;
            const { odataStr } = req.query;
            const result = await fastify.sportSiteWalletTransactionService.calculateSumIncAndDecForSportSiteWallet( sportSiteWalletUUID, { odataStr } );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
