const fastifyPlugin = require( "fastify-plugin" ),
    sequelizeOdata = require( "odata-sequelize" );

const plugin = async( fastify, opts ) => {
    const sequelizeObj = fastify.dbClient.sequelizeObj;
    const parseOdata = ( odataStr ) => sequelizeOdata( odataStr, sequelizeObj );

    fastify.decorate( "sequelizeOdataUtil", parseOdata );
};

module.exports = fastifyPlugin( plugin, { "dependencies": [ "dbClient" ] } );
