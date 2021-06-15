const { destMediaFileLocationName, maxPicsCount } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, resourceAuthorizeUtil, mediaService, sportSiteService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.mediaService = mediaService;
        this.sportSiteService = sportSiteService;
    }

    async add( userUUID, mediaObj ) {
        mediaObj.ownerResourceType = "SportSite";
        mediaObj.ownerResourceUUID = mediaObj.sportSiteUUID;
        const destMediaFileName = `sportSite_${mediaObj.sportSiteUUID}_${Date.now()}`;
        const sportSite = await this.sportSiteService.getById( mediaObj.sportSiteUUID );
        const { "count": sportSiteMediaCount, "rows": sportSiteMedias } = await this.mediaService.getAndCountAllForOwnerResource( mediaObj.sportSiteUUID );
        
        if ( sportSiteMediaCount < maxPicsCount ) {
            if ( mediaObj.isMain ) {
                for ( const sportSiteMedia of sportSiteMedias ) {
                    if ( sportSiteMedia.isMain ) {
                        return this.errorUtil.throwClientError( "بیش از یک مدیا نمیتواند به عنوان مدیا اصلی استفاده شود", 400 );
                    }
                }
            }
            const media = await this.mediaService.add( mediaObj, destMediaFileName, destMediaFileLocationName );
            if ( mediaObj.isMain ) {
                sportSite.cache().update( { "mainPicUrl": media.destFileUrl } );
            }
            await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, media.uuid, "all" );
            return media;
        }
        return this.errorUtil.throwClientError( "تعداد مدیا بیش از حد مجاز است", 400 );
    }

    async editById( sportSiteMediaUUID, sportSiteMediaObj ) {
        const sportSiteMedia = await this.mediaService.getById( sportSiteMediaUUID );

        if ( sportSiteMedia.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این کسب و کار ثبت نشده است", 400 );
        }
        if ( sportSiteMediaObj.isMain !== undefined ) {
            const sportSite = await this.sportSiteService.getById( sportSiteMedia.ownerResourceUUID );
            
            if ( sportSiteMediaObj.isMain ) {
                const mainSportSiteMedia = await this.models.Media.findOne( {
                    "where": {
                        [ this.sequelizeObj.Op.and ]: [
                            {
                                "uuid": {
                                    [ this.sequelizeObj.Op.ne ]: sportSiteMediaUUID
                                }
                            },
                            {
                                "ownerResourceUUID": {
                                    [ this.sequelizeObj.Op.eq ]: sportSite.uuid
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
                if ( mainSportSiteMedia ) {
                    return this.errorUtil.throwClientError( "بیش از یک مدیا نمیتواند به عنوان مدیا اصلی استفاده شود", 400 );
                }
                await sportSiteMedia.update( sportSiteMediaObj );
                await sportSite.cache().update( { "mainPicUrl": sportSiteMedia.destFileUrl } );
            } else {
                if ( !sportSiteMedia.isMain ) {
                    return this.errorUtil.throwClientError( "امکان ویرایش وجود ندارد", 400 );
                }
                await sportSiteMedia.update( sportSiteMediaObj );
                await sportSite.cache().update( { "mainPicUrl": null } );
            }
        } else {
            await sportSiteMedia.update( sportSiteMediaObj );
        }
    }

    async removeById( sportSiteMediaUUID ) {
        const sportSiteMedia = await this.mediaService.getById( sportSiteMediaUUID );

        if ( sportSiteMedia.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این کسب و کار ثبت نشده است", 400 );
        }
        if ( sportSiteMedia.isMain ) {
            const sportSite = await this.sportSiteService.getById( sportSiteMedia.ownerResourceUUID );
            
            await sportSite.cache().update( { "mainPicUrl": null } );
        }
        await this.mediaService.removeMedia( sportSiteMedia );
    }

    async getById( sportSiteMediaUUID ) {
        const sportSiteMedia = await this.mediaService.getById( sportSiteMediaUUID );

        if ( sportSiteMedia.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این کسب و کار ثبت نشده است", 400 );
        }
        return sportSiteMedia;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, checkSportSiteExist = true } = {} ) {
        if ( checkSportSiteExist ) {
            const sportSite = await this.sportSiteService.checkExistById( sportSiteUUID );

            if ( !sportSite ) {
                return this.errorUtil.throwClientError( "چنین کسب و کاری ثبت نشده است", 404 );
            }
        }
        return await this.mediaService.getAllForOwnerResource( sportSiteUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }
}

module.exports = Logics;
