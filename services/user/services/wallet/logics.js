class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, walletService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.walletService = walletService;
      
    }

    async add( userWalletObj, { "transaction": t = null } = {} ) {
        userWalletObj.ownerResourceUUID = userWalletObj.userUUID;
        userWalletObj.ownerResourceType = "User";
        return await this.walletService.add( userWalletObj, { "transaction": t } );
    }

    async getById( uuid, { "transaction": t = null } = {} ) {
        const userWallet = await this.walletService.getById( uuid, { "transaction": t, "getTransactions": true } );

        if ( userWallet.ownerResourceType !== "User" ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این کاربر ثبت نشده است", 400 );
        }
        return userWallet;
    }

    async getForUser( userUUID, { "transaction": t = null, getTransaction = true, transactionOdataStr = null } = {} ) {
        const userWallet = await this.walletService.getForOwnerResource( userUUID, { "transaction": t, getTransaction, transactionOdataStr } );

        if ( userWallet.ownerResourceType !== "User" ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی برای این کاربر ثبت نشده است", 400 );
        }
        return userWallet;
    }
}

module.exports = Logics;
