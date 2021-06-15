const ClientError = require( "../types/ClientError" );

module.exports = ( roles ) => async( request, reply ) => {
    const userRole = request.user.role;
   
    if ( userRole === "admin" ) {
        return;
    } else if ( !roles.includes( userRole ) ) {
        throw new ClientError( "دسترسی غیر مجاز", 401 );
    }
};
