const faker = require( "faker" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        const sportSiteUUIDObjs = await models.SportSite.findAll( {
            "attributes": [ "uuid" ]
        } );

        for ( const sportSiteUUIDObj of sportSiteUUIDObjs ) {
            try {
                const sportSiteWallet = await models.Wallet.build( {
                    "ownerResourceUUID": sportSiteUUIDObj.uuid,
                    "ownerResourceType": "SportSite",
                    "amount": 0
                } ).save();
    
                for ( let i = 0; i < 2; i++ ) {
                    await models.WalletTransaction.build( {
                        "walletUUID": sportSiteWallet.uuid,
                        "amount": 5000,
                        "transactionType": "dec",
                        "description": "تسویه حساب"
                    } ).save();
                }
                for ( let i = 0; i < 2; i++ ) {
                    await models.WalletTransaction.build( {
                        "walletUUID": sportSiteWallet.uuid,
                        "amount": 5000,
                        "transactionType": "inc",
                        "description": "رزرو مشتری"
                    } ).save();
                }
            } catch ( err ) {
                console.log( err );
                console.log( "re try" );
                continue;
            }
        }
    },
    "down": ( models ) => {
    }
};
