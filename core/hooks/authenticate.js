const ClientError = require( "../types/ClientError" );

module.exports = ( tokenUtil ) => async( request, reply ) => {
    try {
        const [ , token ] = request.headers.authorization.split( ' ' );
        const isRevokedToken = await tokenUtil.isRevoked( token );

        if ( isRevokedToken ) {
            throw new ClientError( "دسترسی غیر مجاز", 401 );
        }
        await request.jwtVerify();
    } catch ( err ) {
        throw new ClientError( "دسترسی غیر مجاز", 401 );
    }
};

