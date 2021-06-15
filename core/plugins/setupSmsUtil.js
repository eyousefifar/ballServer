const fastifyPlugin = require( "fastify-plugin" ),
    { KavehnegarStrategy, GhasedakStrategy } = require( "../libs/smsUtil" );

const plugin = async( fastify, opts ) => {
    let smsUtil;

    if ( opts.mode === "kavehnegar" ) {
        smsUtil = new KavehnegarStrategy( opts.kavehnegarApiKey, opts.kavehnegarVerifyEndPoint );
    } else if ( opts.mode === "ghasedak" ) {
        smsUtil = new GhasedakStrategy( opts.ghasedakApiKey, opts.ghasedakVerifyEndPoint );
    } else {
        throw new Error( "sms operator not supported" );
    }
    
    fastify.decorate( "smsUtil", smsUtil );
};

module.exports = fastifyPlugin( plugin );
