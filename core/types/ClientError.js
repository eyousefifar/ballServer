class ClientError extends Error {
    constructor( errs, responseStatusCode ) {
        super( "client error" );
        this.errs = errs;
        this.responseStatusCode = responseStatusCode;
    }
    getErrorObj() {
        let errs = this.errs;

        return {
            errs
        };
    }
    getErrorStr() {
        return `Error $$ type:clientError $$ error:${this.err}`;
    }
}

module.exports = ClientError;
