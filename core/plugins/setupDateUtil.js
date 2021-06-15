const fastifyPlugin = require( "fastify-plugin" ),
    DateUtil = require( "../libs/dateUtil" );

const plugin = async( fastify, opts ) => {
    const dateUtil = new DateUtil();

    fastify.decorate( "dateUtil", dateUtil );
};

module.exports = fastifyPlugin( plugin );
