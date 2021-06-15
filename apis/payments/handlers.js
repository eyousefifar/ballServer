module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getPaymentHandler": async( req, reply ) => {
            const { paymentUUID } = req.params;
            const result = await fastify.paymentService.getById( paymentUUID );

            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
