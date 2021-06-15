module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteSessionDiscountHandler": async( req, reply ) => {
            const sportSiteSessionDiscountObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteSessionDiscount = await fastify.sportSiteSessionDiscountService.add( userUUID, sportSiteSessionDiscountObj );

            reply.status( 201 ).send( sportSiteSessionDiscount );
        },
        "editSportSiteSessionDiscountHandler": async( req, reply ) => {
            const { sportSiteSessionDiscountUUID } = req.params;
            const sportSiteSessionDiscountObj = req.body;

            await fastify.sportSiteSessionDiscountService.editById( sportSiteSessionDiscountUUID, sportSiteSessionDiscountObj );
            reply.status( 200 ).send();
        },
        "getSportSiteSessionDiscountHandler": async( req, reply ) => {
            const { sportSiteSessionDiscountUUID } = req.params;
            const sportSiteSessionDiscount = await fastify.sportSiteSessionDiscountService.getById( sportSiteSessionDiscountUUID );
            
            reply.status( 200 ).send( sportSiteSessionDiscount );
        }
    };
 
    fastify.decorate( "httpHandlers", httpHandlers );
};
