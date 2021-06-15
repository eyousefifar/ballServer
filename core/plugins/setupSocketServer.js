const fastifyPlugin = require( "fastify-plugin" ),
    ws = require( "ws" ),
    WebSocketServerWrapper = require( "ws-server-wrapper" );

const plugin = async( fastify, opts ) => {
    const WebSocketServer = ws.Server;
    const wss = new WebSocketServer( {
        "server": fastify.server,
        "port": opts.port
    } );
    const wrappedWss = new WebSocketServerWrapper( wss );

    fastify.decorate( "wws", wrappedWss );
};

module.exports = fastifyPlugin( plugin );
