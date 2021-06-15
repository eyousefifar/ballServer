const { homeForGetSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/",
        {
            "preHandler": [
                fastify.getFromApiCache( fastify.apiCachingUtil )
            ],
            "schema": homeForGetSchema
        }, httpHandlers.getHomeHandler );
};
