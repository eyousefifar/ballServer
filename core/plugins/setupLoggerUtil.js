const fastifyPlugin = require( "fastify-plugin" ),
    { PinoStrategy } = require( "../libs/logManagerUtil" );
    
const plugin = async( fastify, opts ) => {
    let logManagerUtil;

    if ( opts.mode === "pino" ) {
        logManagerUtil = new PinoStrategy( opts );
    } else {
        throw new Error( "log manager not supported" );
    }
    fastify.decorate( "logManagerUtil", { "logManagerUtil": logManagerUtil, "logManagerUtilMode": opts.mode } );
};

module.exports = fastifyPlugin( plugin );
