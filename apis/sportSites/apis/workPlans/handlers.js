module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteWorkPlanHandler": async( req, reply ) => {
            const sportSiteWorkPlanObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteWorkPlan = await fastify.sportSiteWorkPlanService.add( userUUID, sportSiteWorkPlanObj );
            
            reply.status( 201 ).send( sportSiteWorkPlan );
        },
        "editSportSiteWorkPlanHandler": async( req, reply ) => {
            const { sportSiteWorkPlanUUID } = req.params;
            const sportSiteWorkPlanObj = req.body;

            await fastify.sportSiteWorkPlanService.editById( sportSiteWorkPlanUUID, sportSiteWorkPlanObj );
            reply.status( 200 ).send();
        },
        "getSportSiteWorkPlanHandler": async( req, reply ) => {
            const { sportSiteWorkPlanUUID } = req.params;
            const result = await fastify.sportSiteWorkPlanService.getById( sportSiteWorkPlanUUID );
    
            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
