const fastifyPlugin = require( "fastify-plugin" ),
    pump = require( "pump" ),
    fs = require( "fs" );

const plugin = async( fastify, opts ) => {
    const fileUtil = {
        "moveFileStreams": ( sourceStream, destStream ) => new Promise( ( resolve, reject ) => {
            pump( sourceStream, destStream, ( err ) => {
                if ( err ) {
                    reject( err );
                }
                resolve();
            } );
        } ),
        "moveFileStreamsByDestLocation": ( file, destLocation, destFileName ) => new Promise( ( resolve, reject ) => {
            const destPath = `${destLocation}/${destFileName}.${ file.extname}`;
            const sourceStream = file.stream;
            const destStream = fs.createWriteStream( destPath );

            destStream.on( "error", ( err ) => reject( err ) );
            destStream.on( "finish", () => resolve( destPath ) );
            pump( sourceStream, destStream, ( err ) => {
                if ( err ) {
                    reject( err );
                }
                resolve();
            } );
        } ),
        "deleteFile": ( filePath ) => new Promise( ( resolve, reject ) => {
            fs.unlink( filePath, ( err ) => {
                if ( err ) {
                    reject( err );
                }
                resolve();
            } );
        } )
    };

    fastify.decorate( "fileUtil", fileUtil );
};

module.exports = fastifyPlugin( plugin );
