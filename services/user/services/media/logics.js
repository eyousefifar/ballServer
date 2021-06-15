const { destMediaFileLocationName } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, resourceAuthorizeUtil, { fileStorageUtilMode }, userService, mediaService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.fileStorageUtilMode = fileStorageUtilMode;
        this.mediaService = mediaService;
        this.userService = userService;
    }

    async add( userUUID, mediaObj ) {
        mediaObj.ownerResourceType = "User";
        mediaObj.ownerResourceUUID = userUUID;
        const destMediaFileName = `user_${userUUID}_${Date.now()}`;
        const user = await this.userService.getById( userUUID );
        const userProfilePic = user.profilePicUrl;
        let media;
        
        if ( userProfilePic ) {
            media = ( await this.mediaService.getAllForOwnerResource( userUUID ) )[ 0 ];
            await this.mediaService.removeById( media.uuid );
        }
        media = await this.mediaService.add( mediaObj, destMediaFileName, destMediaFileLocationName );
        await user.cache().update( { "profilePicUrl": media.destFileUrl } );
        return media;
    }

    async getById( userMediaUUID ) {
        const userMedia = await this.mediaService.getById( userMediaUUID );

        if ( userMedia.ownerResourceType !== "User" ) {
            return this.errorUtil.throwClientError( "چنین مدیایی برای این کاربر ثبت نشده است", 400 );
        }
        return userMedia;
    }
}

module.exports = Logics;
