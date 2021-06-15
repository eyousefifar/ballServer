const fastifyPlugin = require( "fastify-plugin" ),
    { PoosheStrategy } = require( "../libs/notificationUtil" );

const plugin = async( fastify, opts ) => {
    let notificationUtil;

    if ( opts.mode === "pooshe" ) {
        notificationUtil = new PoosheStrategy( opts.poosheApiKey, opts.poosheSendEndPoint, opts.poosheAppIds );
    } else if ( opts.mode === "fireBase" ) {
        throw new Error( "not supported yet" );
    } else {
        throw new Error( "not supported" );
    }
    fastify.decorate( "notificationUtil", notificationUtil );
};

module.exports = fastifyPlugin( plugin );
