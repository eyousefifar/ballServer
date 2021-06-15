const { "maxPageSize": userWalletTransactionMaxPage } = require( "../../../../../../services/user/services/wallet/services/transaction/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getUserWalletHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { getTransaction = true, transactionOdataStr = null } = req.query;
            const userWallet = await fastify.userWalletService.getForUser( userUUID, { getTransaction, transactionOdataStr } );

            reply.status( 200 ).send( userWallet );
        },
        "getAllUserWalletTransactionsForUserWalletHandler": async( req, reply ) => {
            const { userWalletUUID } = req.params;
            const { pageNumber = 1, pageSize = userWalletTransactionMaxPage, odataStr } = req.query;
            const result = await fastify.userWalletTransactionService.getAllForUserWallet( userWalletUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "submitAddAmountRequestHandler": async( req, reply ) => {
            const { amount } = req.body;
            const userUUID = req.user.uuid;
            const result = await fastify.userWalletTransactionService.submitAddAmountTransactionRequest( amount, userUUID );

            reply.status( 200 ).send( result );
        },
        "verifyAddAmountRequestHandler": async( req, reply ) => {
            const { status, "token": paymentToken, "clientrefid": clientRefId, "refid": refId } = req.query;
            const { paymentUtilMode } = fastify.paymentUtil;
            
            if ( paymentUtilMode === "payir" ) {
                if ( !status ) {
                    fastify.errorUtil.throwClientError( "پرداخت انجام نشده", 400 );
                }
                await fastify.userWalletTransactionService.verifyAddAmountTransactionRequestForPayir( paymentToken );
            } else if ( paymentUtilMode === "payping" ) {
                await fastify.userWalletTransactionService.verifyAddAmountTransactionRequestForPayping( refId, clientRefId );
            }
            reply.status( 200 ).send();
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
