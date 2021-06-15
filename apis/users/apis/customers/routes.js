const { customerForAddSchema, customerForEditSchema,
    customer_reserveItemCardForGetAllSchema, customer_likeForGetAllSchema,
    customer_rateForGetAllSchema, customer_supportTicketForGetAllSchema,
    customer_paymentForGetAllSchema, admin_customer_customerCreditForGetAll, customer_ownSportSiteRateSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": customerForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addCustomerHandler );

    fastify.get( "/with-token",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getCustomerHandler );

    fastify.get( "/",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.getAllCustomersHandler );

    fastify.put( "/",
        {
            "schema": customerForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.editCustomerHandler );

    fastify.get( "/reserveItemCards", {
        "schema": customer_reserveItemCardForGetAllSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer" ] )
        ]
    }, httpHandlers.getAllReserveItemCardsForOwnerUserHandler );

    fastify.get( "/nearestReserveItem/timer", {
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer" ] )
        ]
    }, httpHandlers.getNearestReserveItemTimerForOwnerUserHandler );

    fastify.get( "/likes",
        {
            "schema": customer_likeForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getAllSportSiteLikesForOwnerUserHandler );

    fastify.get( "/rates",
        {
            "schema": customer_rateForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getAllSportSiteRatesForOwnerUserHandler );

    fastify.get( "/sportSite/:sportSiteUUID/rate",
        {
            "schema": customer_ownSportSiteRateSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getSportSiteRateForOwnerUserAndOwnerSportSiteHandler );

    fastify.get( "/supportTickets",
        {
            "schema": customer_supportTicketForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getAllSportSiteSupportTicketsForOwnerUserHandler );

    fastify.get( "/payments",
        {
            "schema": customer_paymentForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getAllPaymentsForOwnerUserHandler );

    fastify.get( "/credit",
        {
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getCreditForOwnerUserHandler );

    fastify.get( "/:userUUID/credits",
        {
            "schema": admin_customer_customerCreditForGetAll,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.getAllCreditsForUserHandler );
};
