const fastifyPlugin = require( "fastify-plugin" ),
    EmailUtil = require( "../libs/emailUtil" );
const plugin = async( fastify, opts ) => {
    const emailUtil = new EmailUtil( opts.host, opts.port, opts.secureStatus, opts.userName, opts.password, opts.from );

    fastify.decorate( "emailUtil", emailUtil );
};

module.exports = fastifyPlugin( plugin );
