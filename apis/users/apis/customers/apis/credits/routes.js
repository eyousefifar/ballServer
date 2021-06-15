const { customerCreditForAdd, customerCreditForGet, customerCreditForEdit } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": customerCreditForAdd,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addCustomerCredit );

    fastify.get( "/:customerCreditUUID",
        {
            "schema": customerCreditForGet,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.customerCreditUUID )
            ]
        }, httpHandlers.getCustomerCredit );

    fastify.put( "/:customerCreditUUID",
        {
            "schema": customerCreditForEdit,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.editCustomerCredit );
};
