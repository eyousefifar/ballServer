module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getUserWalletTransactionHandler": async( req, reply ) => {
            const { userWalletTransactionUUID } = req.params;
            const result = await fastify.logics.getById( userWalletTransactionUUID );

            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
