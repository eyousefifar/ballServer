const
    pino = require( 'pino' ),
    stdSerializers = require( "pino-std-serializers" );

class PinoStrategy {
    constructor( opts ) {
        this.loger = pino();
    }

    logError( _err, req, res ) {
        const serializedError = stdSerializers.err( _err );
        const serializedReq = stdSerializers.req( req );
        const serializedRes = stdSerializers.res( res );

        this.loger.error( { "err": serializedError, "req": serializedReq, "res": serializedRes } );
    }

    logInfo( _err, req, res ) {
        const serializedError = stdSerializers.err( _err );
        const serializedReq = stdSerializers.req( req );
        const serializedRes = stdSerializers.res( res );

        this.loger.info( { "err": serializedError, "req": serializedReq, "res": serializedRes } );
    }

    logfatal( _err, req, res ) {
        const serializedError = stdSerializers.err( _err );
        const serializedReq = stdSerializers.req( req );
        const serializedRes = stdSerializers.res( res );

        this.loger.fatal( { "err": serializedError, "req": serializedReq, "res": serializedRes } );
    }
}

module.exports = { PinoStrategy };
