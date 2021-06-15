class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, sportSiteReserveService, rateService, rateItemService, commentService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.errorUtil = errorUtil;
        this.sportSiteService = sportSiteService;
        this.sportSiteReserveService = sportSiteReserveService;
        this.rateService = rateService;
        this.rateItemService = rateItemService;
        this.commentService = commentService;
    }

    async add( userUUID, sportSiteRateObj, sportSiteRateItemObjs ) {
        sportSiteRateObj.ownerResourceUUID = sportSiteRateObj.sportSiteUUID;
        sportSiteRateObj.ownerResourceType = `SportSite`;
        sportSiteRateObj.userUUID = userUUID;
        sportSiteRateObj.commentObj.ownerResourceType = `SportSiteRate`;
        sportSiteRateObj.commentObj.userUUID = userUUID;
        sportSiteRateObj.commentObj.userType = "customer";
        const sportSite = await this.sportSiteService.getById( sportSiteRateObj.sportSiteUUID );
        const sportSiteReserveForCustomerExistStatus = await this.sportSiteReserveService.checkExistSubmitedForOwnerUserAndSportSite( userUUID, sportSiteRateObj.sportSiteUUID );

        if ( !sportSiteReserveForCustomerExistStatus ) {
            return this.errorUtil.throwClientError( "امکان امتیازدهی وجود ندارد شما از این مجموعه رزروی انجام نداده اید", 400 );
        }
        const sportSiteRateItemsCount = sportSiteRateItemObjs.length;
        let sportSiteRateItemsAvg = 0;

        for ( const sportSiteRateItemObj of sportSiteRateItemObjs ) {
            sportSiteRateItemsAvg += sportSiteRateItemObj.rateAmount / sportSiteRateItemsCount;
        }
        sportSiteRateObj.rateAmount = sportSiteRateItemsAvg;
        const sportSiteRateAvg = sportSite.rateAvg + sportSiteRateItemsAvg / ( sportSite.rateCount + 1 );

        return await this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const sportSiteRateComment = await this.commentService.add( sportSiteRateObj.commentObj, { "transaction": t } );

            sportSiteRateObj.commentUUID = sportSiteRateComment.uuid;
            const [ sportSiteRate ] = await Promise.all( [
                this.rateService.add( sportSiteRateObj, { "transaction": t } ),
                sportSite.cache().update( { "rateAvg": sportSiteRateAvg, "rateCount": sportSite.rateCount + 1 }, { "transaction": t } )
            ] );
           
            for ( const sportSiteRateItemObj of sportSiteRateItemObjs ) {
                sportSiteRateItemObj.rateUUID = sportSiteRate.uuid;
            }
            const [ sportSiteRateItems ] = await Promise.all( [
                this.rateItemService.addBulk( sportSiteRateItemObjs, { "transaction": t } ),
                this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteRate.uuid, "all" )
            ] );
            sportSiteRate.dataValues.items = sportSiteRateItems;
            sportSiteRate.dataValues.comment = sportSiteRateComment;
            return sportSiteRate;
        } );
    }

    async editById( sportSiteRateUUID, sportSiteRateObj, sportSiteRateItemObjs ) {
        const sportSiteRate = await this.rateService.getById( sportSiteRateUUID );
        const [ sportSiteRateComment, sportSiteRateItems, sportSite ] = await Promise.all( [
            this.commentService.getById( sportSiteRate.commentUUID ),
            this.rateItemService.getAllForRate( sportSiteRateUUID ),
            this.sportSiteService.getById( sportSiteRate.ownerResourceUUID )
        ] );
        const sportSiteRateItemsCount = sportSiteRateItems.length;
        let sportSiteRateItemsAvg = 0;
        let checked = false;
        
        for ( const sportSiteRateItem of sportSiteRateItems ) {
            for ( const sportSiteRateItemObj of sportSiteRateItemObjs ) {
                if ( !checked && sportSiteRateItemObj.itemName === sportSiteRateItem.itemName ) {
                    checked = true;
                    sportSiteRateItemsAvg += sportSiteRateItemObj.rateAmount / sportSiteRateItemsCount;
                    sportSiteRateItemObj.uuid = sportSiteRateItem.uuid;
                }
            }
            if ( !checked ) {
                sportSiteRateItemsAvg += sportSiteRateItem.rateAmount / sportSiteRateItemsCount;
            }
            checked = false;
        }
        const sportSiteRatesAvg = sportSite.rateAvg - sportSiteRate.rateAmount + ( sportSiteRateItemsAvg / sportSite.rateCount );

        await this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            let sportSiteRateItemsToUpdate = [];

            for ( const sportSiteRateItemObj of sportSiteRateItemObjs ) {
                const sportSiteRateItem = await this.rateItemService.getById( sportSiteRateItemObj.uuid );
                sportSiteRateItemsToUpdate.push( sportSiteRateItem.update( sportSiteRateItemObj, { "transaction": t } ) );
            }
            return await Promise.all( [
                sportSiteRate.update( { "rateAmount": sportSiteRateItemsAvg }, { "transaction": t } ),
                sportSite.cache().update( { "rateAvg": sportSiteRatesAvg }, { "transaction": t } ),
                sportSiteRateComment.update( sportSiteRateObj.commentObj, { "transaction": t } ),
                ...sportSiteRateItemsToUpdate
            ] );
        } );
    }

    async getById( sportSiteRateUUID ) {
        const sportSiteRate = await this.rateService.getById( sportSiteRateUUID );
        const rateItems = await this.rateItemService.getAllForRate( sportSiteRate.uuid );

        sportSiteRate.dataValues.rateItems = rateItems;
        return sportSiteRate;
    }

    async getAllForSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, getItem = false, itemOdataStr = null, getComment = true, commentOdataStr = null } = {} ) {
        return await this.rateService.getAllForOwnerResource( sportSiteUUID, { pageNumber, pageSize, odataStr, getItem, itemOdataStr, getComment, commentOdataStr } );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, getItem = false, itemOdataStr = null, getComment = true, commentOdataStr = null } = {} ) {
        return await this.rateService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr, getItem, itemOdataStr, getComment, commentOdataStr } );
    }

    async getForOwnerSportSiteAndOwnerUser( userUUID, ownerResourceUUID, { getItem = false, itemOdataStr = null, getComment = true, commentOdataStr = null } = {} ) {
        return await this.rateService.getForOwnerResourceAndOwnerUser( userUUID, ownerResourceUUID, { getItem, itemOdataStr, getComment, commentOdataStr } );
    }

    async checkExistForOwnerSportSiteAndOwnerUser( userUUID, ownerResourceUUID ) {
        return await this.rateService.checkExistForOwnerResourceAndOwnerUser( userUUID, ownerResourceUUID );
    }

    async checkPossibilityToRate( userUUID, sportSiteUUID ) {
        const [ sportSiteReserveForCustomerExistStatus, sportSiteRateForCustomerAndSportSiteExistStatus ] = await Promise.all( [
            this.sportSiteReserveService.checkExistSubmitedForOwnerUserAndSportSite( userUUID, sportSiteUUID ),
            this.checkExistForOwnerSportSiteAndOwnerUser( userUUID, sportSiteUUID )
        ] );
        
        if ( !sportSiteReserveForCustomerExistStatus ) {
            return this.errorUtil.throwClientError( "امکان امتیازدهی وجود ندارد شما از این مجموعه رزروی انجام نداده اید", 400 );
        }
        if ( sportSiteRateForCustomerAndSportSiteExistStatus ) {
            return this.errorUtil.throwClientError( "امکان امتیازدهی وجود ندارد شما به این مجموعه یک مرتبه امتیاز داده اید", 400 );
        }
        return true;
    }

    async averageAllForSportSite( sportSiteUUID ) {
        return await this.rateService.averageAllByItemNameGroupForOwnerResource( sportSiteUUID );
    }
}

module.exports = Logics;
