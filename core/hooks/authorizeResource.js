const requestMethodToAction = ( reqMethod ) => {
    let action;

    switch ( reqMethod ) {
        case "GET":
            action = "read";
            break;
        case "POST":
            action = "add";
            break;
        case "PUT":
            action = "edit";
            break;
        case "DELETE":
            action = "delete";
            break;
        default:
            break;
    }
    return action;
};

module.exports = ( { resourceAuthorizeUtil, errorUtil }, resourceFinderCallback, _action = null ) => async( req, reply ) => {
    const userRole = req.user.role;

    if ( userRole === "admin" ) {
        return;
    }
    const userUUID = req.user.uuid;
    const resourceUUID = resourceFinderCallback( req );
    const action = _action ? _action : requestMethodToAction( req.raw.method );
    const checkAccessAllPermission = await resourceAuthorizeUtil.checkResourceAccess( userUUID, resourceUUID, "all" );

    if ( !checkAccessAllPermission ) {
        const checkAccessActionPermission = await resourceAuthorizeUtil.checkResourceAccess( userUUID, resourceUUID, action );
            
        if ( !checkAccessActionPermission ) {
            errorUtil.throwClientError( "دسترسی غیر مجاز", 401 );
        }
    }
};
