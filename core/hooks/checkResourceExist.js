const ClientError = require( "../types/ClientError" );

module.exports = ( { resourceType, resourceTypeFinder }, fastify, findResourceUUIDCallback, errorMessage ) => async( req, reply ) => {
    const resourceUUID = findResourceUUIDCallback( req );

    if ( !resourceUUID ) {
        throw new Error( "resourceUUID is not valid" );
    }
    let resourceModel;

    if ( resourceType ) {
        resourceModel = fastify.dbClient.models[ resourceType ];
    } else if ( resourceTypeFinder ) {
        resourceModel = fastify.dbClient.models[ resourceTypeFinder( req ) ];
    } else {
        throw new Error( "resourceType or resourceTypeFinder is required" );
    }
    if ( !resourceModel ) {
        throw new Error( "resource model not found" );
    }
    const resourceCount = await resourceModel.count( { "where": { "uuid": resourceUUID } } );

    if ( !resourceCount ) {
        throw new ClientError( errorMessage, 404 );
    }
};
