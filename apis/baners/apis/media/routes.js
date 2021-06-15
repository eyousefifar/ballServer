const { banerMediaForAdd, banerMediaForEditSchema, banerMediaForGetSchema, banerMediaForRemoveSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;
    
    fastify.post( "/",
        {
            "schema": banerMediaForAdd,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.addBanerMediaHandler );

    fastify.put( "/:banerMediaUUID",
        {
            "schema": banerMediaForEditSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.banerMediaUUID )
            ]
        }, httpHandlers.editBanerMediaHandler );
    
    fastify.get( "/:banerMediaUUID",
        {
            "schema": banerMediaForGetSchema
        }, httpHandlers.getBanerMediaHandler );


    fastify.delete( "/:banerMediaUUID",
        {
            "schema": banerMediaForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "admin" ] )
            ]
        }, httpHandlers.removeBanerMediaHandler );
};
