class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, walletTransactionService, sportSiteWalletService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.walletTransactionService = walletTransactionService;
        this.sportSiteWalletService = sportSiteWalletService;
    }

    async add( sportSiteWalletTransactionObj, { "transaction": t = null } = {} ) {
        const walletExist = this.sportSiteWalletService.checkExist( sportSiteWalletTransactionObj.sportSiteWalletUUID );

        if ( !walletExist ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این سایت ورزشی ثبت نشده است", 400 );
        }
        return await this.walletTransactionService.add( sportSiteWalletTransactionObj, { "transaction": t } );
    }

    async getById( sportSiteWalletTransactionUUID, { "transaction": t = null } = {} ) {
        return await this.walletTransactionService.getById( sportSiteWalletTransactionUUID, { "transaction": t } );
    }

    async getAllForSportSiteWallet( sportSiteWalletUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        return await this.walletTransactionService.getAllForWallet( sportSiteWalletUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }

    async sumAmountForSportSiteWallet( sportSiteWalletUUID, transactionType, { odataStr = null, queryObj = null } = {} ) {
        return await this.walletTransactionService.sumAmount( sportSiteWalletUUID, transactionType, { odataStr, queryObj, transactionType } );
    }

    async calculateSumIncAndDecForSportSiteWallet( sportSiteWalletUUID, { odataStr = null, queryObj = null } = {} ) {
        return await this.walletTransactionService.calculateSumIncAndDecForWallet( sportSiteWalletUUID, { odataStr, queryObj } );
    }
}

module.exports = Logics;
