module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addCustomerCredit": async( req, reply ) => {
            const customerCreditObj = req.body;

            await fastify.customerCreditService.add( customerCreditObj );
            reply.status( 200 ).send();
        },
        "getCustomerCredit": async( req, reply ) => {
            const { customerCreditUUID } = req.params;
            const result = await fastify.customerCreditService.getById( customerCreditUUID );

            reply.status( 200 ).send( result );
        },
        "editCustomerCredit": async( req, reply ) => {
            const { customerCreditUUID } = req.params;
            const customerCreditObj = req.query;
            const result = await fastify.customerCreditService.editById( customerCreditUUID, customerCreditObj );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
