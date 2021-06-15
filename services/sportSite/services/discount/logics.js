const moment = require( "moment" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, resourceAuthorizeUtil, sportSiteService, discountService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.discountService = discountService;
    }

    async add( userUUID, sportSiteDiscountObj ) {
        sportSiteDiscountObj.ownerResourceUUID = sportSiteDiscountObj.sportSiteUUID;
        sportSiteDiscountObj.ownerResourceType = "SportSite";
        const sportSiteDiscount = await this.discountService.addPrivate( sportSiteDiscountObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteDiscount.uuid, "all" );
        return sportSiteDiscount;
    }

    async editById( sportSiteDiscountUUID, sportSiteDiscountObj ) {
        const nowDate = new Date();
        const sportSiteDiscount = await this.getById( sportSiteDiscountUUID );
        const discountExpireDate = moment( sportSiteDiscount.expireDate, "YYYY-MM-DD" ).toDate();

        if ( !sportSiteDiscount.enableStatus && discountExpireDate > nowDate ) {
            await sportSiteDiscount.cache().update( sportSiteDiscountObj );
        } else {
            return this.errorUtil.throwClientError( "امکان ویرایش وجود ندارد", 400 );
        }
    }

    async getById( sportSiteDiscountUUID ) {
        const sportSiteDiscount = await this.discountService.getPrivate( sportSiteDiscountUUID );

        if ( sportSiteDiscount.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return sportSiteDiscount;
    }

    async getByCode( sportSiteDiscountUUID ) {
        const sportSiteDiscount = await this.discountService.getPrivateByCode( sportSiteDiscountUUID );

        if ( sportSiteDiscount.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return sportSiteDiscount;
    }

    async getForSportSiteAndValidateByCode( userUUID, sportSiteDiscountCode, sportSiteUUID ) {
        const sportSiteDiscount = await this.getByCode( sportSiteDiscountCode );

        if ( sportSiteDiscount.ownerResourceUUID !== sportSiteUUID ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        if ( !sportSiteDiscount.enableStatus ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        await this.discountService.validatePrivate( sportSiteDiscount );
        const checkUserUseDiscountPrivate = await this.discountService.checkUsePrivateDiscount( userUUID, sportSiteDiscount.uuid );

        if ( checkUserUseDiscountPrivate ) {
            return this.errorUtil.throwClientError( "شما قبلا از این کد استفاده کردید", 400 );
        }
        return sportSiteDiscount;
    }

    async useDiscountByCode( userUUID, sportSiteDiscountCode, { "transaction": t = null } = {} ) {
        const sportSiteDiscount = await this.getByCode( sportSiteDiscountCode );

        if ( sportSiteDiscount.ownerResourceUUID !== sportSiteUUID ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        await this.useDiscount( userUUID, sportSiteDiscount, { "transaction": t } );
    }

    async useDiscount( userUUID, sportSiteDiscount, { "transaction": t = null } = {} ) {
        return await this.discountService.usePrivateDiscount( userUUID, sportSiteDiscount, { "transaction": t } );
    }
}

module.exports = Logics;
