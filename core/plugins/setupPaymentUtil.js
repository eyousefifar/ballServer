const fastifyPlugin = require( "fastify-plugin" ),
    { PayIrStrategy, PayPingStrategy } = require( "../libs/paymentUtil" );

const plugin = async( fastify, opts ) => {
    let paymentUtil;

    if ( opts.mode === "payir" ) {
        paymentUtil = new PayIrStrategy( opts.payirApiKey, opts.payirSendEndPoint, opts.payirVerifyEndPoint, opts.payirGatewayEndPoint );
    } else if ( opts.mode === "payping" ) {
        paymentUtil = new PayPingStrategy( opts.paypingApiKey, opts.paypingSendEndPoint, opts.paypingVerifyEndPoint, opts.paypingGatewayEndPoint );
    } else {
        throw new Error( "payment gateway not supported" );
    }
    fastify.decorate( "paymentUtil", { "paymentUtil": paymentUtil, "paymentUtilMode": opts.mode } );
};

module.exports = fastifyPlugin( plugin );
