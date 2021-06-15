module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteReserveByWalletPaymentTypeHandler": async( req, reply ) => {
            const { sportSiteReserveObj, sportSiteReserveItemObjs } = req.body;
            const userUUID = req.user.uuid;
            const sportSiteReserve = await fastify.sportSiteReserveService.addByWalletPaymentType( userUUID, sportSiteReserveObj, sportSiteReserveItemObjs );

            reply.status( 201 ).send( sportSiteReserve );
        },
        "submitAddSportSiteReserveByDirectPaymentTypeRequestHandler": async( req, reply ) => {
            const { sportSiteReserveObj, sportSiteReserveItemObjs } = req.body;
            const userUUID = req.user.uuid;
            const paymentLink = await fastify.sportSiteReserveService.submitAddReserveByDirectPaymentTypeRequest( userUUID, sportSiteReserveObj, sportSiteReserveItemObjs );

            reply.status( 200 ).send( paymentLink );
        },
        "addSportSiteReserveByDirectPaymentTypeHandler": async( req, reply ) => {
            const { status, "token": paymentToken, "clientrefid": clientRefId, "refid": refId } = req.query;
            const { paymentUtilMode } = fastify.paymentUtil;
            let result;

            if ( paymentUtilMode === "payir" ) {
                if ( !status ) {
                    fastify.errorUtil.throwClientError( "پرداخت انجام نشده", 400 );
                }
                result = await fastify.sportSiteReserveService.verifyAddByDirectPaymentTypeRequestForPayIr( paymentToken );
            } else if ( paymentUtilMode === "payping" ) {
                result = await fastify.sportSiteReserveService.verifyAddByDirectPaymentTypeRequestForPayPing( refId, clientRefId );
            }
            reply.status( 201 ).send( result );
        },
        "getSportSiteReserveHandler": async( req, reply ) => {
            const { sportSiteReserveUUID } = req.params;
            const result = await fastify.sportSiteReserveService.getById( sportSiteReserveUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteReserveItemsForSportSiteReserveHandler": async( req, reply ) => {
            const { sportSiteReserveUUID } = req.params;
            const { pageNumber = 1, pageSize = 20, odataStr } = req.query;
            const result = await fastify.sportSiteReserveItemService.getAllForReserve( sportSiteReserveUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
