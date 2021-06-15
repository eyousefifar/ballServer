module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addSportSiteDiscountHandler": async( req, reply ) => {
            const SportSiteDiscountObj = req.body;
            const userUUID = req.user.uuid;
            const sportSiteDiscount = await fastify.sportSiteDiscountService.add( userUUID, SportSiteDiscountObj );

            reply.status( 201 ).send( sportSiteDiscount );
        },
        "editSportSiteDiscountHandler": async( req, reply ) => {
            const { sportSiteDiscountUUID } = req.params;
            const sportSiteDiscountObj = req.body;

            await fastify.sportSiteDiscountService.editById( sportSiteDiscountUUID, sportSiteDiscountObj );
            reply.status( 200 ).send();
        },
        "getSportSiteDiscountHandler": async( req, reply ) => {
            const { sportSiteDiscountUUID } = req.params;
            const sportSiteDiscount = await fastify.sportSiteDiscountService.getById( sportSiteDiscountUUID );

            reply.status( 200 ).send( sportSiteDiscount );
        },
        "getAndvalidateSportSiteDiscountByCodeHandler": async( req, reply ) => {
            const { sportSiteDiscountCode } = req.params;
            const { sportSiteUUID } = req.body;
            const userUUID = req.user.uuid;
            const sportSiteDiscountValidateStatus = await fastify.sportSiteDiscountService.getForSportSiteAndValidateByCode( userUUID, sportSiteDiscountCode, sportSiteUUID );

            reply.status( 200 ).send( sportSiteDiscountValidateStatus );
        }
    };
 
    fastify.decorate( "httpHandlers", httpHandlers );
};
