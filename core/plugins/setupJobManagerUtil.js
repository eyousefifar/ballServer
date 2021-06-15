const fastifyPlugin = require( "fastify-plugin" ),
    { BullStrategy } = require( "../libs/jobManagerUtil" );

const plugin = async( fastify, opts ) => {
    let jobManagerUtil;

    if ( opts.mode === "bull" ) {
        jobManagerUtil = new BullStrategy( opts );
    } else {
        throw new Error( "job manager not supported" );
    }
    fastify.decorate( "jobManagerUtil", { "jobManagerUtil": jobManagerUtil, "jobManagerUtilMode": opts.mode } );
};

module.exports = fastifyPlugin( plugin );
