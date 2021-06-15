const { banerForAddSchema, banerForGetSchema, banerForGetAllSchema, banerForEditSchema, banerForRemoveSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/",
        {
            "schema": banerForAddSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addBanerHandler );

    fastify.put( "/:banerUUID",
        {
            "schema": banerForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.editBanerHandler );

    fastify.get( "/:banerUUID",
        {
            "schema": banerForGetSchema
        }, httpHandlers.getBanerHandler );

    fastify.get( "/",
        {
            "schema": banerForGetAllSchema
        }, httpHandlers.getAllBanersHandler );

    fastify.delete( "/:banerUUID",
        {
            "schema": banerForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.removeBanerHandler );
};
