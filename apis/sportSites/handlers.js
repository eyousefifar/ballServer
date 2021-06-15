const { "maxPageSize": sportSiteMaxPage } = require( "../../services/sportSite/configs" ).constants.pagination,
    { "maxPageSize": sportSiteMediaMaxPage } = require( "../../services/sportSite/services/media/configs" ).constants.pagination,
    { "maxPageSize": sportSiteWorkPlanMaxPage } = require( "../../services/sportSite/services/workPlan/configs" ).constants.pagination,
    { "maxPageSize": sportSiteHdateMaxPage } = require( "../../services/sportSite/services/hdate/configs" ).constants.pagination,
    { "maxPageSize": sportSiteRateMaxPage } = require( "../../services/sportSite/services/rate/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSessionMaxPage } = require( "../../services/sportSite/services/session/configs" ).constants.pagination,
    { "maxPageSize": sportSiteLikeMaxPage } = require( "../../services/sportSite/services/like/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSupportTicketMaxPage } = require( "../../services/sportSite/services/supportTicket/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteForProviderHandler": async( req, reply ) => {
            const sportSiteObj = req.body;
            const userUUID = req.user.uuid;
            const sportSite = await fastify.sportSiteService.add( userUUID, sportSiteObj );
            
            reply.status( 201 ).send( sportSite );
        },
        "addSportSiteForAdminHandler": async( req, reply ) => {
            const sportSiteObj = req.body;
            const userUUID = sportSiteObj.userUUID;
            const sportSite = await fastify.sportSiteService.add( userUUID, sportSiteObj );
            
            reply.status( 201 ).send( sportSite );
        },
        "editSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const sportSiteObj = req.body;
    
            await fastify.sportSiteService.editById( sportSiteUUID, sportSiteObj );
            reply.status( 200 ).send();
        },
        "getSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteService.getById( sportSiteUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSitesHandler": async( req, reply ) => {
            const { pageNumber = 1, pageSize = sportSiteMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteService.getAll( { pageNumber, pageSize, odataStr } );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteHdatesForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteHdateMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteHdateService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "getAllSportSiteMediaForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteMediaMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteMediaService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "getSportSiteLikeForSportSiteAndCustomerHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteLikeService.getForSportSiteAndUser( userUUID, sportSiteUUID );
            
            reply.status( 200 ).send( result );
        },
        "checkPosibilitySportSiteRateForSportSiteAndCustomerHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteRateService.checkPossibilityToRate( userUUID, sportSiteUUID );
            
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteLikesForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteLikeMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteLikeService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        },
        "countSportSiteLikesForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteLikeService.countAllForSportSite( sportSiteUUID );

            reply.status( 200 ).send( result );
        },
        "getAllSportSiteSupportTicketsForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteSupportTicketMaxPage, odataStr, getUser = true, userOdataStr = null, getComment, commentOdataStr } = req.query;
            const result = await fastify.sportSiteSupportTicketService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr, getUser, userOdataStr, getComment, commentOdataStr } );

            reply.status( 200 ).send( result );
        },
        "getAllSportSiteWorkPlansForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteWorkPlanMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteWorkPlanService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr } );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteSessionsForSportSiteForProviderHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteSessionMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteSessionService.getAllForSportSite( "provider", sportSiteUUID, { pageNumber, pageSize, odataStr } );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteSessionsForSportSiteForCustomerHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteSessionMaxPage, odataStr } = req.query;
            const result = await fastify.sportSiteSessionService.getAllForSportSite( "customer", sportSiteUUID, { pageNumber, pageSize, odataStr } );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteReserveItemCardsForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteSessionMaxPage, odataStr, userName, sessionDate } = req.query;
            const result = await fastify.sportSiteReserveItemService.getAllCardsForOwnerSportSite( sportSiteUUID, { pageNumber, pageSize, odataStr, userName, sessionDate } );
    
            reply.status( 200 ).send( result );
        },
        "getSportSitePageHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteService.getPage( sportSiteUUID );
    
            reply.status( 200 ).send( result );
        },
        "getSportSiteWalletHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { odataStr = null, getTransaction = true, transactionOdataStr = null, getTotalIncome = false } = req.query;
            const result = await fastify.sportSiteWalletService.getForSportSite( sportSiteUUID, { odataStr, getTransaction, transactionOdataStr, getTotalIncome } );
    
            reply.status( 200 ).send( result );
        },
        "averageAllSportSiteRatesForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const result = await fastify.sportSiteRateService.averageAllForSportSite( sportSiteUUID );
    
            reply.status( 200 ).send( result );
        },
        "getAllSportSiteRatesForSportSiteHandler": async( req, reply ) => {
            const { sportSiteUUID } = req.params;
            const { pageNumber = 1, pageSize = sportSiteRateMaxPage, getComment = true, commentOdataStr = null, getItem = false, itemOdataStr = null, getUser = true, userOdataStr = null } = req.query;
            const result = await fastify.sportSiteRateService.getAllForSportSite( sportSiteUUID, { pageNumber, pageSize, getComment, commentOdataStr, getItem, itemOdataStr, getUser, userOdataStr } );
    
            reply.status( 200 ).send( result );
        }
    };
    fastify.decorate( "httpHandlers", httpHandlers );
};

