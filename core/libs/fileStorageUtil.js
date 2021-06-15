const fs = require( "fs" ),
    pump = require( "pump" ),
    minio = require( "minio" );

class LocalFileStorageStrategy {
    // its not complete yet
    constructor( accessFileEndpoint ) {
        this.accessFileEndpoint = accessFileEndpoint;
    }

    saveFileStream( sourceStream, destStream ) {
        return new Promise( ( resolve, reject ) => {
            pump( sourceStream, destStream, ( err ) => {
                if ( err ) {
                    reject( err );
                }
                resolve();
            } );
        } );
    }

    saveFile( file, destFileName, destFileLocation ) {
        return new Promise( async( resolve, reject ) => {
            const destFilePath = `${destFileLocation}/${destFileName}.${file.extname}`;
            const sourceFileStream = file.stream;
            const destFileStream = fs.createWriteStream( destFilePath );

            destFileStream.on( "error", ( err ) => reject( err ) );
            destFileStream.on( "finish", () => resolve( destFileStream ) );
            this.saveFileStream( sourceFileStream, destFileStream )
                .then( () => {
                    return `${this.accessFileEndpoint}/${destFileLocation}/${destFileName}`;
                } )
                .catch( ( err ) => {
                    reject( err );
                } );
        } );
    }

    deleteFile( destFileLocation, destFileName ) {
        const filePath = `${destFileLocation}/${destFileName}`;

        return new Promise( ( resolve, reject ) => {
            fs.unlink( filePath, ( err ) => {
                if ( err ) {
                    reject( err );
                }
                resolve();
            } );
        } );
    }
}

class MinioFileStorageStrategy {
    constructor( accessFileEndpoint, host, port, accessKey, secretKey, desFileLocationObjs ) {
        this.accessFileEndpoint = accessFileEndpoint;
        this.host = host;
        this.port = port;
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.desFileLocationObjs = desFileLocationObjs;
        this.client = new minio.Client( {
            "endPoint": this.host,
            "port": parseInt( this.port ),
            "accessKey": this.accessKey,
            "secretKey": this.secretKey,
            "useSSL": false
        } );
    }

    async checkExistDestFileLocation( destFileLocation ) {
        return await this.client.bucketExists( destFileLocation );
    }
    
    async createDestFileLocation( destFileLocation, destFileLocationPolicy = null ) {
        await this.client.makeBucket( destFileLocation, "est-ir" );
        if ( destFileLocationPolicy ) {
            let policy;

            if ( destFileLocationPolicy === "ReadOnly" ) {
                policy = `
                {
                  "Version": "2012-10-17",
                  "Statement": [
                    {
                      "Action": [
                        "s3:GetBucketLocation",
                        "s3:ListBucket"
                      ],
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": [
                          "*"
                        ]
                      },
                      "Resource": [
                        "arn:aws:s3:::${destFileLocation}"
                      ],
                      "Sid": ""
                    },
                    {
                      "Action": [
                        "s3:GetObject"
                      ],
                      "Effect": "Allow",
                      "Principal": {
                        "AWS": [
                          "*"
                        ]
                      },
                      "Resource": [
                        "arn:aws:s3:::${destFileLocation}/*"
                      ],
                      "Sid": ""
                    }
                  ]
                }`;
            }
            await this.client.setBucketPolicy( destFileLocation, policy );
        }
    }
    async saveFile( file, destFileName, destFileLocation ) {
        const filePath = file.path;

        if ( !await this.checkExistDestFileLocation( destFileLocation ) ) {
            await this.createDestFileLocation( destFileLocation );
        }
        await this.client.fPutObject( destFileLocation, destFileName, filePath, {
            "Content-Type": file.mime
        } );
        return `${this.accessFileEndpoint}/${destFileLocation}/${destFileName}`;
    }
    async deleteFile( destFileName, destFileLocation ) {
        return await this.client.removeObject( destFileLocation, destFileName );
    }
    async setup() {
        for ( const destFileLocationObj of this.desFileLocationObjs ) {
            if ( !await this.checkExistDestFileLocation( destFileLocationObj.destFileLocation ) ) {
                await this.createDestFileLocation( destFileLocationObj.destFileLocation, destFileLocationObj.policy || null );
            }
        }
    }
}

module.exports = { LocalFileStorageStrategy, MinioFileStorageStrategy };
