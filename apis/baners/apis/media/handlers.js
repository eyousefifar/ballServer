module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addBanerMediaHandler": async( req, reply ) => {
            const banerMediaObj = req.body;
            const banerMeida = await fastify.banerMediaService.add( banerMediaObj );

            reply.status( 200 ).send( banerMeida );
        },
        "editBanerMediaHandler": async( req, reply ) => {
            const { banerMediaUUID } = req.params;
            const banerMediaObj = req.body;

            await fastify.banerMediaService.editById( banerMediaUUID, banerMediaObj );
            reply.status( 200 ).send();
        },
        "getBanerMediaHandler": async( req, reply ) => {
            const { banerMediaUUID } = req.params;
            const result = await fastify.banerMediaService.getById( banerMediaUUID );

            reply.status( 200 ).send( result );
        },
        "removeBanerMediaHandler": async( req, reply ) => {
            const { banerMediaUUID } = req.params;

            await fastify.banerMediaService.removeById( banerMediaUUID );
            reply.status( 200 ).send();
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
