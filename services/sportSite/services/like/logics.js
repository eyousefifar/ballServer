class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, likeService, sportSiteService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.likeService = likeService;
        this.sportSiteService = sportSiteService;
    }

    async add( userUUID, sportSiteLikeObj ) {
        sportSiteLikeObj.ownerResourceUUID = sportSiteLikeObj.sportSiteUUID;
        sportSiteLikeObj.ownerResourceType = "SportSite";
        sportSiteLikeObj.userUUID = userUUID;
        const sportSiteLike = await this.likeService.add( sportSiteLikeObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteLike.uuid, "all" );
        return sportSiteLike;
    }

    async removeById( sportSiteLikeUUID ) {
        await this.likeService.removeById( sportSiteLikeUUID );
    }

    async getById( sportSiteLikeUUID ) {
        const sportSiteLike = await this.likeService.getById( sportSiteLikeUUID );

        if ( sportSiteLike.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین لایکی برای این کسب و کار ثبت نشده است", 400 );
        }
        return sportSiteLike;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, checkSportSiteExist = true } = {} ) {
        return await this.likeService.getAllForOwnerResource( sportSiteUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        return await this.likeService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }

    async getForSportSiteAndUser( userUUID, sportSiteUUID ) {
        return await this.likeService.getForOwnerResourceAndOwnerUser( userUUID, sportSiteUUID );
    }

    async countAllForSportSite( sportSiteUUID ) {
        return await this.likeService.countAllForOwnerResource( sportSiteUUID );
    }

    async getAllLikedSportSitesByUser( userUUID ) {
        const queryObj = {
            "attributes": [ "ownerResourceUUID" ],
            [ this.sequelizeObj.Op.and ]: [
                {
                    "userUUID": {
                        [ this.sequelizeObj.Op.eq ]: userUUID
                    }
                },
                {
                    "ownerResourceType": {
                        [ this.sequelizeObj.Op.eq ]: "SportSite"
                    }
                }
            ]
        };
        const likedSportSiteUUIDs = await this.likeService.getAllForOwnerUser( userUUID, { queryObj } );
        const likedSportSites = await this.sportSiteService.getRange( likedSportSiteUUIDs );

        return likedSportSites;
    }
}

module.exports = Logics;
