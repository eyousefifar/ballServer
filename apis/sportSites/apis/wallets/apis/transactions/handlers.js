module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getSportSiteWalletTransactionHandler": async( req, reply ) => {
            const { sportSiteWalletTransactionUUID } = req.params;
            const result = await fastify.logics.getById( sportSiteWalletTransactionUUID );

            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
