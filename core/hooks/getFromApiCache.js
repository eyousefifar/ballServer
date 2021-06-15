module.exports = ( apiCachingUtil ) => async( request, reply ) => {
    const getFromCache = request.headers[ "get-from-cache" ];

    if ( getFromCache === "false" ) {
        return;
    }
    const result = await apiCachingUtil.getResponseFromCacheByReq( request );

    if ( result ) {
        reply.status( 200 ).send( result );
    }
};
