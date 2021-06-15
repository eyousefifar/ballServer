const fastifyPlugin = require( "fastify-plugin" ),
    geoRedis = require( "georedis" );


const plugin = async( fastify, opts ) => {
    const geoRedisObj = geoRedis.initialize( fastify.redisDbClient );
    
    const geoUtil = {
        "addLocation": ( key, location ) => new Promise( ( resolve, reject ) => {
            geoRedisObj.addLocation( key, location, ( err, res ) => {
                if ( err ) {
                    reject( err );
                } else {
                    resolve();
                }
            } );
        } ),
        "findNearBy": ( centerlocation, reduis ) => new Promise( ( resolve, reject ) => {
            geoRedisObj.nearby( centerlocation, reduis, ( err, res ) => {
                if ( err ) {
                    reject( err );
                } else {
                    resolve( res );
                }
            } );
        } )
    };

    fastify.decorate( "geoUtil", geoUtil );
};

module.exports = fastifyPlugin( plugin, { "dependencies": [ "redisDbClient" ] } );
