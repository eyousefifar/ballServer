class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( walletObj, { "transaction": t = null } = {} ) {
        return await this.models.Wallet.create( walletObj, { "transaction": t } );
    }

    async editById( walletUUID, walletObj, { "transaction": t = null } ) {
        const wallet = await this.getById( walletUUID, { "transaction": t } );

        await wallet.update( walletObj );
    }

    async getById( walletUUID, { "transaction": t = null } = {} ) {
        const wallet = await this.models.Wallet.findByPk( walletUUID, { "transaction": t } );

        if ( !wallet ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی ثبت نشده است", 404 );
        }
        return wallet;
    }

    async getForOwnerResource( ownerResourceUUID, { "transaction": t = null, queryObj = null, odataStr = null, getTransaction = true, transactionOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.ownerResourceUUID = {
                [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
            };
            if ( getTransaction === true || getTransaction === "true" ) {
                const transactionQueryObj = transactionOdataStr ? this.sequelizeOdataUtil( transactionOdataStr ) : {};

                transactionQueryObj.limit = 10;
                queryObj.include = [
                    {
                        "model": this.models.WalletTransaction,
                        "as": "walletTransactions",
                        ...transactionQueryObj
                    }
                ];
            }
        }
        const wallet = await this.models.Wallet.findOne( queryObj, { "transaction": t } );

        if ( !wallet ) {
            return this.errorUtil.throwClientError( "چنین کیف پولی ثبت نشده است", 404 );
        }
        return wallet;
    }

    async checkExist( walletUUID ) {
        const wallet = await this.models.Wallet.count( {
            "where": {
                "uuid": {
                    [ this.sequelizeObj.Op.eq ]: walletUUID
                }
            }
        } );

        return !!wallet;
    }
}

module.exports = Logics;
