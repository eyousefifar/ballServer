class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, walletService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.walletService = walletService;
    }

    async add( walletTransactionObj, { "transaction": t = null } = {} ) {
        return await this.models.WalletTransaction.create( walletTransactionObj, { "transaction": t } );
    }

    async editById( walletTransactionUUID, walletTransactionObj ) {
        const walletTransaction = await this.getById( walletTransactionUUID );

        await walletTransaction.update( walletTransactionObj );
    }

    async getById( walletTransactionUUID, { "transaction": t = null } = {} ) {
        const walletTransaction = await this.models.WalletTransaction.findByPk( walletTransactionUUID, { "transaction": t } );

        if ( !walletTransaction ) {
            return this.errorUtil.throwClientError( "چنین تراکنش کیف پولی ثبت نشده است", 404 );
        }
        return walletTransaction;
    }

    async getAllForWallet( walletUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.walletUUID = {
                [ this.sequelizeObj.Op.eq ]: walletUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.WalletTransaction.findAll( queryObj );
    }

    async sumAmountForWallet( walletUUID, transactionType, { odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.walletUUID = {
                [ this.sequelizeObj.Op.eq ]: walletUUID
            };
            queryObj.where.transactionType = {
                [ this.sequelizeObj.Op.eq ]: transactionType
            };
        }
        return await this.models.WalletTransaction.sum( "amount", queryObj );
    }

    async calculateSumIncAndDecForWallet( walletUUID, { queryObj = null, odataStr = null } ) {
        const [ inc, dec ] = await Promise.all( [
            this.sumAmountForWallet( walletUUID, "inc", { "queryObj": queryObj, "odataStr": odataStr } ),
            this.sumAmountForWallet( walletUUID, "dec", { "queryObj": queryObj, "odataStr": odataStr } )
        ] );

        return { inc, dec };
    }
}

module.exports = Logics;
