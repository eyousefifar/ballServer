const fastifyPlugin = require( "fastify-plugin" ),
    { LocalFileStorageStrategy, MinioFileStorageStrategy } = require( "../libs/fileStorageUtil" );
    
const plugin = async( fastify, opts ) => {
    let fileStorageUtil;
    if ( opts.mode === "local" ) {
        fileStorageUtil = new LocalFileStorageStrategy( opts.localAccessFileEndpoint );
    } else if ( opts.mode === "minio" ) {
        fileStorageUtil = new MinioFileStorageStrategy(
            opts.minioAccessFileEndpoint,
            opts.minioHost,
            opts.minioPort,
            opts.minioAccessKey,
            opts.minioSecretKey,
            opts.minioDestFileLocationObjs
        );
        await fileStorageUtil.setup();
    } else {
        throw new Error( "fileStorageMode is not valid" );
    }
    fastify.decorate( "fileStorageUtil", { "fileStorageUtilMode": opts.mode, "fileStorageUtil": fileStorageUtil } );
};

module.exports = fastifyPlugin( plugin );
