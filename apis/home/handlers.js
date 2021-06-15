const { "maxPageSize": homeMaxPage } = require( "../../services/home/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getHomeHandler": async( req, reply ) => {
            const { pageNumber = 1, pageSize = homeMaxPage, sportSiteOdataStr = null, banerOdataStr = null } = req.query;
            const result = await fastify.homeService.get( { pageNumber, pageSize, sportSiteOdataStr, banerOdataStr } );

            await fastify.apiCachingUtil.setResponseToCacheByReq( req, result );
            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
