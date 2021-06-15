const fastifyPlugin = require( "fastify-plugin" ),
    { FieldsLimitError, FileSizeLimitError, FilesLimitError, PartsLimitError, parse, isFile } = require( "then-busboy" ),
    kMultipart = Symbol( "multipart" ),
    ClientError = require( "../types/ClientError" );

const pasrFormDataBody = async( req ) => {
    const result = {};

    ( await parse( req ) ).forEach( ( value, key ) => {
        if ( isFile( value ) ) {
            result[ key ] = value;
        } else {
            result[ key ] = value.value;
        }
    } );
    return result;
};
const plugin = async( fastify, opts ) => {
    fastify.addContentTypeParser( "multipart", async( req ) => {
        let body;

        try {
            body = await pasrFormDataBody( req, opts );
        } catch ( err ) {
            if ( err instanceof FilesLimitError ) {
                throw new ClientError( "تعداد فایل فرستاده شده بیش از حد مجاز است", 400 );
            } else if ( err instanceof FileSizeLimitError ) {
                throw new ClientError( "حجم فایل بیش از حد مجاز است", 400 );
            } else if ( err instanceof FieldsLimitError ) {
                throw new ClientError( "حجم فیلد ارسالی بیش از حد مجاز است", 400 );
            } else if ( err instanceof PartsLimitError ) {
                throw new ClientError( "فرم ارسالی نامعتبر است", 400 );
            }
            throw err;
        }
        req[ kMultipart ] = true;
        return body;
    } );
    
};

module.exports = fastifyPlugin( plugin );
