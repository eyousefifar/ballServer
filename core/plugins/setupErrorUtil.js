const fastifyPlugin = require( "fastify-plugin" ),
    ErrorUtil = require( "../libs/errorUtil" );

const plugin = async( fastify ) => {
    const errorUtil = new ErrorUtil( fastify.logManagerUtil );

    fastify.decorate( "errorUtil", errorUtil );
};

module.exports = fastifyPlugin( plugin );
