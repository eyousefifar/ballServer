const { paymentCallbackUrl } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, { paymentUtil, paymentUtilMode }, userService, userWalletService, walletTransactionService, paymentService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.paymentUtil = paymentUtil;
        this.paymentUtilMode = paymentUtilMode;
        this.userService = userService;
        this.userWalletService = userWalletService;
        this.walletTransactionService = walletTransactionService;
        this.paymentService = paymentService;
    }

    async add( userWalletTransactionObj, { "transaction": t = null } = {} ) {
        return await this.walletTransactionService.add( userWalletTransactionObj, { "transaction": t } );
    }

    async editById( userWalletTransactionUUID, walletTransactionObj, { "transaction": t = null } = {} ) {
        return await this.walletTransactionService.editById( userWalletTransactionUUID, walletTransactionObj, { "transaction": t } );
    }

    async getById( userWalletTransactionUUID, { "transaction": t = null } = {} ) {
        return await this.walletTransactionService.getById( userWalletTransactionUUID, { "transaction": t } );
    }

    async getAllForUserWallet( userWalletUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        return await this.walletTransactionService.getAllForWallet( userWalletUUID, { pageNumber, pageSize, odataStr, queryObj } );
    }

    async submitAddAmountTransactionRequest( amount, userUUID ) {
        const user = await this.userService.getById( userUUID );
        const factorNumber = new Date().valueOf();
        const payment = await this.paymentService.add( { "amount": amount, "userUUID": userUUID, "paymentType": "شارژ کیف پول", "factorNumber": factorNumber } );
        let paymentResult;

        if ( this.paymentUtilMode === "payping" ) {
            paymentResult = await this.paymentUtil.send( amount, paymentCallbackUrl, payment.uuid, {
                "payerName": user.name,
                "description": "شارژ کیف پول"
            } );
        } else if ( this.paymentUtilMode === "payir" ) {
            paymentResult = await this.paymentUtil.send( amount, paymentCallbackUrl, factorNumber );
        }
        return { "paymentLink": paymentResult.paymentLink };
    }

    async verifyAddAmountTransactionRequestForPayir( paymentToken ) {
        const { factorNumber, transId } = await this.paymentUtil.verify( paymentToken );
        const payment = await this.models.Payment.findOne( {
            "where": {
                "factorNumber": {
                    [ this.sequelizeObj.Op.eq ]: factorNumber
                }
            }
        } );

        if ( !payment ) {
            return this.errorUtil.throwClientError( "چنین پرداختی وجود ندارد", 400 );
        }
        if ( payment.transactionId ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ازقبل در سیستم وجود دارد", 400 );
        }
        return await this.sequelizeDbObj.transaction( async( t ) => {
            await payment.update( {
                "transactionId": transId,
                "status": true
            }, { "transaction": t } );
            return await this.createAddAmountTransaction( payment, { "transaction": t } );
        } );
    }

    async verifyAddAmountTransactionRequestForPayping( refid, clientRefId ) {
        const payment = await this.models.Payment.findByPk( clientRefId );

        if ( !payment ) {
            return this.errorUtil.throwClientError( "چنین پرداختی وجود ندارد", 400 );
        }
        if ( payment.transactionId ) {
            return this.errorUtil.throwClientError( "چنین پرداختی ازقبل در سیستم وجود دارد", 400 );
        }
        return await this.sequelizeDbObj.transaction( async( t ) => {
            await Promise.all( [
                this.paymentUtil.verify( refid, payment.amount ),
                payment.update( {
                    "transactionId": refid,
                    "status": true
                }, { "transaction": t } )
            ] );
            return await this.createAddAmountTransaction( payment, { "transaction": t } );
        } );
    }

    async createAddAmountTransaction( payment, { "transaction": t = null } = {} ) {
        const userWallet = await this.userWalletService.getForUser( payment.userUUID );
            
        await Promise.all( [
            userWallet.update( {
                "amount": this.sequelizeDbObj.literal( `amount + ${payment.amount}` )
            }, { "transaction": t } ),
            this.add( {
                "amount": payment.amount,
                "transactionType": "inc",
                "description": "افزایش اعتبار",
                "walletUUID": userWallet.uuid,
                "paymentUUID": payment.uuid
            }, { "transaction": t } )
        ] );
    }
}

module.exports = Logics;
