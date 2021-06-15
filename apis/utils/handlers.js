const moment = require( "moment-jalaali" );

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getDateHandler": async( req, reply ) => {
            const dateStr = moment( new Date() ).format( "jYYYY-jMM-jDD HH-mm-ss" );

            reply.status( 200 ).send( { "date": dateStr } );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
