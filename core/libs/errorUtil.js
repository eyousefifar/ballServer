const { "UniqueConstraintError": SequelizeUniqueConstraintError, "ValidationError": SequelizeValidationError } = require( "sequelize" ),
    ClientError = require( "../types/ClientError" );

class ErrorUtil {
    constructor( { logManagerUtil } ) {
        this.logManagerUtil = logManagerUtil;
    }

    handleError( err, req, reply ) {
        this.logManagerUtil.logError( err, req, reply );
        if ( err instanceof ClientError ) {
            reply
                .status( err.responseStatusCode )
                .send( {
                    "success": false,
                    ...err.getErrorObj()
                } );
        } else if ( err instanceof SequelizeValidationError || err instanceof SequelizeUniqueConstraintError ) {
            const errMessages = [];
            
            for ( let errObj of err.errors ) {
                errMessages.push( errObj.message );
            }
            const clientError = new ClientError( errMessages, 409 );

            reply
                .status( clientError.responseStatusCode )
                .send( {
                    "success": false,
                    ...clientError.getErrorObj()
                } );
        } else if ( err.validation ) {
            reply
                .status( 400 )
                .send( {
                    "success": false,
                    "errs": err.message
                } );
        } else {
            reply
                .status( 500 )
                .send( {
                    "success": false
                } );
        }
    }

    throwClientError( err, responseStatusCode ) {
        throw new ClientError( err, responseStatusCode );
    }
}
module.exports = ErrorUtil;
