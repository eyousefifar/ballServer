class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, { fileStorageUtil } ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.fileStorageUtil = fileStorageUtil;
    }

    async uploadMediaToFileStorage( mediaFile, destMediaFileName, destMediaFileLocation ) {
        return await this.fileStorageUtil.saveFile( mediaFile, destMediaFileName, destMediaFileLocation );
    }
    
    async add( mediaObj, destMediaFileName, destMediaFileLocation ) {
        const mediaFile = mediaObj.file;

        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const destMediafileUrl = await this.uploadMediaToFileStorage( mediaFile, destMediaFileName, destMediaFileLocation );
            
            return await this.models.Media.create( {
                ...mediaObj,
                "destFileName": destMediaFileName,
                "destFileLocation": destMediaFileLocation,
                "destFileUrl": destMediafileUrl,
                "destFileMimeType": mediaFile.mime
            }, { "transaction": t } );
        } );
    }

    async editById( mediaUUID, mediaObj, { "transaction": t = null } = {} ) {
        const media = await this.getById( mediaUUID, { "transaction": t } );

        await media.update( mediaObj, { "transaction": t } );
    }

    async removeMediaFile( destMediaFileName, destMediaFileLocation ) {
        await this.fileStorageUtil.deleteFile( destMediaFileName, destMediaFileLocation );
    }

    async removeMedia( media, { "transaction": t = null } = {} ) {
        await Promise.all( [
            media.destroy( { "transaction": t } ),
            this.removeMediaFile( media.destFileName, media.destFileLocation )
        ] );
    }

    async removeById( mediaUUID, { "transaction": t = null } = {} ) {
        const media = await this.getById( mediaUUID, { "transaction": t } );

        await this.removeMedia( media, { "transaction": t } );
    }

    async getById( mediaUUID, { "transaction": t = null } = {} ) {
        const media = await this.models.Media.findByPk( mediaUUID, { "transaction": t } );

        if ( !media ) {
            return this.errorUtil.throwClientError( "چنین مدیایی ثبت نشده است", 404 );
        }
        return media;
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.ownerResourceUUID = {
                [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Media.findAll( queryObj );
    }

    async getAndCountAllForOwnerResource( ownerResourceUUID ) {
        return await this.models.Media.findAndCountAll( {
            "where": {
                "ownerResourceUUID": {
                    [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                }
            }
        } );
    }
}

module.exports = Logics;
