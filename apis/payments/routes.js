const { paymentForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/:paymentUUID",
        {
            "schema": paymentForGetSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.paymentUUID )
            ]
        }, httpHandlers.getPaymentHandler );
};
