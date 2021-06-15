const moment = require( "moment" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sportSiteService, sportSiteSessionService, sportSiteSessionTimeService, discountService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.sportSiteService = sportSiteService;
        this.sportSiteSessionService = sportSiteSessionService;
        this.sportSiteSessionTimeService = sportSiteSessionTimeService;
        this.discountService = discountService;
    }

    async add( userUUID, sportSiteSessionDiscountObj ) {
        sportSiteSessionDiscountObj.ownerResourceUUID = sportSiteSessionDiscountObj.sportSiteSessionUUID;
        sportSiteSessionDiscountObj.ownerResourceType = "SportSiteSession";
        const nowDate = new Date();
        const sportSiteSessionDiscountExpireDate = moment( "YYYY-MM-DD", sportSiteSessionDiscountObj.expireDate ).toDate();
        const sportSiteSession = await this.sportSiteSessionService.getById( "provider", sportSiteSessionDiscountObj.sportSiteSessionUUID );
        const sportSiteSessionTime = await this.sportSiteSessionTimeService.getById( sportSiteSession.sessionTimeUUID );
        const sportSite = await this.sportSiteService.getById( sportSiteSessionTime.sportSiteUUID );

        if ( sportSiteSessionDiscountExpireDate < nowDate ) {
            return this.errorUtil.throwClientError( "امکان افزودن وجود ندارد", 400 );
        }
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const [ sportSiteSessionDiscount ] = await Promise.all( [
                this.discountService.addPublic( sportSiteSessionDiscountObj, { "transaction": t } ),
                sportSiteSession.update( {
                    "discountPrecent": sportSiteSessionDiscountObj.precent,
                    "discountExpireDate": sportSiteSessionDiscountObj.expireDate
                }, { "transaction": t } )
            ] );
            if ( sportSite.maxDiscountPrecent < sportSiteSessionDiscountObj.precent ) {
                await sportSite.update( { "maxDiscountPrecent": sportSiteSessionDiscountObj.precent, "maxDiscountExpireDate": sportSiteSessionDiscountObj.expireDate } );
            }
            return sportSiteSessionDiscount;
        } );
    }

    async editById( sportSiteSessionDiscountUUID, sportSiteSessionDiscountObj ) {
        const sportSiteSessionDiscount = await this.discountService.getPublicById( sportSiteSessionDiscountUUID );
        const sportSiteSession = await this.sportSiteSessionService.getById( "provider", sportSiteSessionDiscount.ownerResourceUUID );
        const sportSiteSessionTime = await this.sportSiteSessionTimeService.getById( sportSiteSession.sessionTimeUUID );
        const sportSite = await this.sportSiteService.getById( sportSiteSessionTime.sportSiteUUID );
        
        if ( sportSiteSessionDiscount.ownerResourceType !== "SportSiteSession" ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سانس ثبت نشده است", 400 );
        }
        await this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            sportSiteSessionDiscount.update( sportSiteSessionDiscountObj );
            sportSiteSession.update( {
                "discountPrecent": sportSiteSessionDiscountObj.precent,
                "discountExpireDate": sportSiteSessionDiscountObj.expireDate
            }, { "transaction": t } );
            if ( sportSite.maxDiscountPrecent < sportSiteSessionDiscountObj.precent ) {
                sportSite.update( { "maxDiscountPrecent": sportSiteSessionDiscountObj.precent, "maxDiscountExpireDate": sportSiteSessionDiscountObj.expireDate } );
            }
        } );
    }

    async getById( sportSiteSessionDiscountUUID ) {
        const sportSiteSessionDiscount = await this.discountService.getPublicById( sportSiteSessionDiscountUUID );

        if ( sportSiteSessionDiscount.ownerResourceType !== "SportSiteSession" ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سانس ثبت نشده است", 400 );
        }
        return sportSiteSessionDiscount;
    }

    async getEnabledAndNotExpiredForSession( sportSiteSessionUUID, expireDate ) {
        const sportSiteSession = this.sportSiteSessionService.checkExist( sportSiteSessionUUID );

        if ( !sportSiteSession ) {
            return this.errorUtil.throwClientError( "چنین سانسی ثبت نشده است", 404 );
        }
        const sportSiteSessionDiscount = await this.discountService.getNotExpireAndEnableForOwnerResource( sportSiteSessionUUID, expireDate );
        return sportSiteSessionDiscount;
    }
}

module.exports = Logics;
