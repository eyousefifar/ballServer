const { sportSiteReserveForAddByWalletPaymentTypeSchema,
    sportSiteReserveForAddByDirectPaymentTypeSchema,
    sportSiteReserveForGetSchema, sportSiteReserveForRemoveSchema,
    sportSiteReserve_sportSiteReserveItemForGetAllSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/paymentType/wallet",
        {
            "schema": sportSiteReserveForAddByWalletPaymentTypeSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.addSportSiteReserveByWalletPaymentTypeHandler );

    fastify.post( "/paymentType/direct/request",
        {
            "schema": sportSiteReserveForAddByDirectPaymentTypeSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.submitAddSportSiteReserveByDirectPaymentTypeRequestHandler );

    fastify.get( "/paymentType/direct/callback", httpHandlers.addSportSiteReserveByDirectPaymentTypeHandler );

    fastify.get( "/:sportSiteReserveUUID", {
        "schema": sportSiteReserveForGetSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveUUID )
        ]
    }, httpHandlers.getSportSiteReserveHandler );

    fastify.get( "/:sportSiteReserveUUID/items", {
        "schema": sportSiteReserve_sportSiteReserveItemForGetAllSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveUUID )
        ]
    }, httpHandlers.getAllSportSiteReserveItemsForSportSiteReserveHandler );
};
