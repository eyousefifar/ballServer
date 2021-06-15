const { destMediaFileLocationName } = require( "./configs" ).constants,
    { maxPicsCount } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, banerService, mediaService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.mediaService = mediaService;
        this.banerService = banerService;
    }

    async add( mediaObj ) {
        mediaObj.ownerResourceType = "Baner";
        mediaObj.ownerResourceUUID = mediaObj.banerUUID;
        const destMediaFileName = `baner_${mediaObj.banerUUID}_${Date.now()}`;
        const baner = await this.banerService.getById( mediaObj.banerUUID );
        const { "count": banerMediaCount, "rows": banerMedias } = await this.mediaService.getAndCountAllForOwnerResource( mediaObj.banerUUID );
        
        if ( banerMediaCount < maxPicsCount ) {
            if ( mediaObj.isMain ) {
                for ( const banerMedia of banerMedias ) {
                    if ( banerMedia.isMain ) {
                        return this.errorUtil.throwClientError( "بیش از یک مدیا نمیتواند به عنوان مدیا اصلی استفاده شود", 400 );
                    }
                }
            }
            const media = await this.mediaService.add( mediaObj, destMediaFileName, destMediaFileLocationName );
            
            if ( mediaObj.isMain ) {
                baner.update( { "mainPicUrl": media.destFileUrl } );
            }
            return media;
        }
        return this.errorUtil.throwClientError( "تعداد مدیا بیش از حد مجاز است", 400 );
    }

    async editById( banerMediaUUID, banerMediaObj ) {
        const banerMedia = await this.mediaService.getById( banerMediaUUID );

        if ( banerMedia.ownerResourceType !== "Baner" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این بنر ثبت نشده است", 400 );
        }
        await banerMedia.update( banerMediaObj );
        if ( banerMediaObj.isMain !== undefined ) {
            const baner = await this.banerService.getById( banerMedia.ownerResourceUUID );
            
            if ( banerMediaObj.isMain ) {
                const mainBanerMedia = await this.models.Media.findOne( {
                    "where": {
                        [ this.sequelizeObj.Op.and ]: [
                            {
                                "uuid": {
                                    [ this.sequelizeObj.Op.ne ]: banerMediaUUID
                                }
                            },
                            {
                                "ownerResourceUUID": {
                                    [ this.sequelizeObj.Op.eq ]: baner.uuid
                                }
                            },
                            {
                                "isMain": {
                                    [ this.sequelizeObj.Op.eq ]: true
                                }
                            }
                        ]
                        
                    }
                } );
                if ( mainBanerMedia ) {
                    return this.errorUtil.throwClientError( "بیش از یک مدیا نمیتواند به عنوان مدیا اصلی استفاده شود", 400 );
                }
                await baner.update( { "mainPicUrl": banerMedia.destFileUrl } );
            } else {
                await baner.update( { "mainPicUrl": null } );
            }
        }
    }

    async removeById( banerMediaUUID ) {
        const banerMedia = await this.mediaService.getById( banerMediaUUID );

        if ( banerMedia.ownerResourceType !== "Baner" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این بنر ثبت نشده است", 400 );
        }
        if ( banerMedia.isMain ) {
            const baner = await this.banerService.getById( banerMedia.ownerResourceUUID );
            
            await baner.update( { "mainPicUrl": null } );
        }
        await this.mediaService.removeMedia( banerMedia );
    }

    async getById( banerMediaUUID ) {
        const banerMedia = await this.mediaService.getById( banerMediaUUID );

        if ( banerMedia.ownerResourceType !== "Baner" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این بنر ثبت نشده است", 400 );
        }
        return banerMedia;
    }
}

module.exports = Logics;
