class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, resourceAuthorizeUtil, walletService, walletTransactionService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
    }

    async add( userUUID, sportSiteWalletObj, { "transaction": t = null } = {} ) {
        sportSiteWalletObj.ownerResourceUUID = sportSiteWalletObj.sportSiteUUID;
        sportSiteWalletObj.ownerResourceType = "SportSite";
        const sportSite = await this.sportSiteService.checkExistById( sportSiteWalletObj.sportSiteUUID );

        if ( !sportSite ) {
            return this.errorUtil.throwClientError( "چنین سایت ورزشی ثبت نشده است", 404 );
        }
        const sportSiteWallet = await this.walletService.add( sportSiteWalletObj, { "transaction": t } );
        
        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteWallet.uuid, "all" );
        return sportSiteWallet;
    }

    async editById( sportSiteWalletUUID, sportSiteWalletObj ) {
        const sportSiteWallet = await this.walletService.getById( sportSiteWalletUUID );

        if ( sportSiteWallet.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        await sportSiteWallet.update( sportSiteWalletObj );
    }

    async getById( sportSiteWalletUUID, { "transaction": t = null } = {} ) {
        const sportSiteWallet = await this.walletService.getById( sportSiteWalletUUID, { "transaction": t } );

        if ( sportSiteWallet.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return await this.walletService.getById( sportSiteWalletUUID, { "transaction": t } );
    }

    async getForSportSite( sportSiteUUID, { "transaction": t = null, getTransaction = true, transactionOdataStr = null, getTotalIncome = false } = {} ) {
        const sportSiteWallet = await this.walletService.getForOwnerResource( sportSiteUUID, { "transaction": t, getTransaction, transactionOdataStr } );
        let totalIncome;

        if ( sportSiteWallet.ownerResourceType !== "SportSite" ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        if ( getTotalIncome === true || getTotalIncome === "true" ) {
            totalIncome = await this.walletTransactionService.sumAmountForWallet( sportSiteWallet.uuid, "inc", { "odataStr": transactionOdataStr } );
        }
        sportSiteWallet.dataValues.totalIncome = totalIncome;
        return sportSiteWallet;
    }

    async checkExist( sportSiteWalletUUID ) {
        const sportSiteWallet = await this.walletService.getById( sportSiteWalletUUID );

        if ( sportSiteWallet.ownerResourceType !== "SportSite" ) {
            return false;
        }
        return true;
    }
}

module.exports = Logics;
