const { "maxPageSize": banerMaxPage } = require( "../../services/baner/configs" ).constants;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addBanerHandler": async( req, reply ) => {
            const banerObj = req.body;
            const baner = await fastify.banerService.add( banerObj );

            reply.status( 201 ).send( baner );
        },
        "removeBanerHandler": async( req, reply ) => {
            const { banerUUID } = req.params;
    
            await fastify.banerService.removeById( banerUUID );
            reply.status( 200 ).send();
        },
        "editBanerHandler": async( req, reply ) => {
            const banerObj = req.body;
            const { banerUUID } = req.params;

            await fastify.banerService.editById( banerUUID, banerObj );
            reply.status( 200 ).send();
        },
        "getBanerHandler": async( req, reply ) => {
            const { banerUUID } = req.params;
            const result = await fastify.banerService.getById( banerUUID );

            reply.status( 200 ).send( result );
        },
        "getAllBanersHandler": async( req, reply ) => {
            const { pageNumber = 1, pageSize = banerMaxPage, odataStr } = req.query;
            const result = await fastify.banerService.getAll( { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};
