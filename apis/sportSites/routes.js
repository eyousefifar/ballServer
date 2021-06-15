const { sportSiteForAddSchema, sportSiteForEditSchema,
    sportSiteForGetSchema, sportSiteForGetAllSchema, sportSite_sportSiteHdateForGetAllSchema,
    sportSite_sportSiteMediaForGetAllSchema, sportSite_sportSiteLikeForGetAllSchema,
    sportSite_sportSiteLikeForCountSchema, sportSite_sportSiteLikeForGetSchema, sportSite_sportSiteRateForCheckSchema,
    sportSite_sportSiteSupportTicketForGetAllSchema, sportSite_sportSiteWorkPlanForGetAllSchema,
    sportSite_sportSiteSessionForGetAllSchema, sportSite_sportSiteRateForAverageAllSchema,
    sportSite_sportSiteRateForGetAllSchema, sportSite_sportSiteWalletForGetSchema,
    sportSite_sportSiteReserveItemCardForGetAllSchema, sportSiteForGetPageSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": sportSiteForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] )
            ]
        }, httpHandlers.addSportSiteForProviderHandler );

    fastify.put( "/:sportSiteUUID",
        {
            "schema": sportSiteForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteUUID )
            ]
        }, httpHandlers.editSportSiteHandler );
    
    fastify.get( "/:sportSiteUUID",
        {
            "schema": sportSiteForGetSchema
        }, httpHandlers.getSportSiteHandler );

    fastify.get( "/", {
        "schema": sportSiteForGetAllSchema
    }, httpHandlers.getAllSportSitesHandler );

    fastify.get( "/:sportSiteUUID/hdates",
        {
            "schema": sportSite_sportSiteHdateForGetAllSchema
        }, httpHandlers.getAllSportSiteHdatesForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/media",
        {
            "schema": sportSite_sportSiteMediaForGetAllSchema
        }, httpHandlers.getAllSportSiteMediaForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/likes",
        {
            "schema": sportSite_sportSiteLikeForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "customer" ] )
            ]
        }, httpHandlers.getAllSportSiteLikesForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/like",
        {
            "schema": sportSite_sportSiteLikeForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.getSportSiteLikeForSportSiteAndCustomerHandler );

    fastify.get( "/:sportSiteUUID/rate/check",
        {
            "schema": sportSite_sportSiteRateForCheckSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] )
            ]
        }, httpHandlers.checkPosibilitySportSiteRateForSportSiteAndCustomerHandler );
    
    fastify.get( "/:sportSiteUUID/likes/count",
        {
            "schema": sportSite_sportSiteLikeForCountSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider", "customer" ] )
            ]
        }, httpHandlers.countSportSiteLikesForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/supportTickets",
        {
            "schema": sportSite_sportSiteSupportTicketForGetAllSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "provider" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteUUID )
            ]
        }, httpHandlers.getAllSportSiteSupportTicketsForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/workPlans", {
        "schema": sportSite_sportSiteWorkPlanForGetAllSchema
    }, httpHandlers.getAllSportSiteWorkPlansForSportSiteHandler );
    
    fastify.get( "/:sportSiteUUID/sessions/userType/customer", {
        "schema": sportSite_sportSiteSessionForGetAllSchema
    }, httpHandlers.getAllSportSiteSessionsForSportSiteForCustomerHandler );

    fastify.get( "/:sportSiteUUID/sessions/userType/provider", {
        "schema": sportSite_sportSiteSessionForGetAllSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteUUID )
        ]
    }, httpHandlers.getAllSportSiteSessionsForSportSiteForProviderHandler );

    fastify.get( "/:sportSiteUUID/reserveItemCards", {
        "schema": sportSite_sportSiteReserveItemCardForGetAllSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteUUID )
        ]
    }, httpHandlers.getAllSportSiteReserveItemCardsForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/rates", {
        "schema": sportSite_sportSiteRateForGetAllSchema
    }, httpHandlers.getAllSportSiteRatesForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/rates/average", {
        "schema": sportSite_sportSiteRateForAverageAllSchema
    }, httpHandlers.averageAllSportSiteRatesForSportSiteHandler );

    fastify.get( "/:sportSiteUUID/wallet", {
        "schema": sportSite_sportSiteWalletForGetSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteUUID )
        ]
    }, httpHandlers.getSportSiteWalletHandler );

    fastify.get( "/:sportSiteUUID/page", {
        "schema": sportSiteForGetPageSchema
    }, httpHandlers.getSportSitePageHandler );
};
