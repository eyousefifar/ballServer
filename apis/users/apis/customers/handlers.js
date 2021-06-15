const { "maxPageSize": customerMaxPage } = require( "../../../../services/user/services/customer/configs" ).constants.pagination,
    { "maxPageSize": sportSiteLikeMaxPage } = require( "../../../../services/sportSite/services/like/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSupportTicketMaxPage } = require( "../../../../services/sportSite/services/supportTicket/configs" ).constants.pagination,
    { "maxPageSize": sportSiteRateMaxPage } = require( "../../../../services/sportSite/services/rate/configs" ).constants.pagination,
    { "maxPageSize": paymentMaxPage } = require( "../../../../services/payment/configs" ).constants.pagination,
    { "maxPageSize": creditMaxPage } = require( "../../../../services/user/services/credit/configs" ).constants.pagination,
    { "maxPageSize": sportSiteReserveMaxPage } = require( "../../../../services/sportSite/services/reserve/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addCustomerHandler": async( req, reply ) => {
            const customerObj = req.body;
            const customer = await fastify.customerService.add( customerObj );
            
            reply.status( 201 ).send( customer );
        },
        "getCustomerHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const result = await fastify.customerService.getById( userUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllCustomersHandler": async( req, reply ) => {
            const { pageNumber = 1, pageSize = customerMaxPage, odataStr, getUser = true, userOdataStr } = req.query;
            const result = await fastify.customerService.getAll( { pageNumber, pageSize, odataStr, getUser, userOdataStr } );
    
            reply.status( 200 ).send( result );
        },
        "getAllReserveItemCardsForOwnerUserHandler": async( req, reply ) => {
            const { pageNumber = 1, pageSize = sportSiteReserveMaxPage, odataStr, getOnlyValidCards = false } = req.query;
            const userUUID = req.user.uuid;
            const result = await fastify.sportSiteReserveItemService.getAllCardsForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, getOnlyValidCards } );
    
            reply.status( 200 ).send( result );
        },
        "getNearestReserveItemTimerForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const result = await fastify.sportSiteReserveItemService.getNearstReserveItemTimeFromNowForUser( userUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteLikesForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber = 1, pageSize = sportSiteLikeMaxPage, odataStr, getSportSite = true, sportSiteOdataStr = null, getSportSiteAddress = true, sportSiteAddressOdataStr = null } = req.query;
            const result = await fastify.likeService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, getSportSite, sportSiteOdataStr, getSportSiteAddress, sportSiteAddressOdataStr } );

            reply.status( 200 ).send( result );
        },
        "getAllSportSiteRatesForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber = 1, pageSize = sportSiteRateMaxPage, odataStr } = req.query;
            const result = await fastify.rateService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "getSportSiteRateForOwnerUserAndOwnerSportSiteHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteRateService.getForOwnerSportSiteAndOwnerUser( userUUID, sportSiteUUID );

            reply.status( 200 ).send( result );
        },
        "getAllSportSiteSupportTicketsForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber = 1, pageSize = sportSiteSupportTicketMaxPage, odataStr, getSportSite = true, sportSiteOdataStr = null, getSportSiteAddress = true, sportSiteAddressOdataStr = null, getComment = false, commentOdataStr = null } = req.query;
            const result = await fastify.sportSiteSupportTicketService.getAllForUser( userUUID, { pageNumber, pageSize, odataStr, getSportSite, sportSiteOdataStr, getSportSiteAddress, sportSiteAddressOdataStr, getComment, commentOdataStr } );

            reply.status( 200 ).send( result );
        },
        "getAllPaymentsForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber = 1, pageSize = paymentMaxPage, odataStr } = req.query;
            const result = await fastify.paymentService.getAllForUser( userUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "getCreditForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const result = await fastify.customerCreditService.getBestUsableForUser( userUUID );

            reply.status( 200 ).send( result );
        },
        "getAllCreditsForUserHandler": async( req, reply ) => {
            const { userUUID } = req.params;
            const { pageNumber = 1, pageSize = creditMaxPage, odataStr } = req.query;
            const result = await fastify.customerCreditService.getAllForUser( userUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "editCustomerHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const customerObj = req.body;
            const result = await fastify.customerService.editById( userUUID, customerObj );

            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
