const { "maxPageSize": userWalletTransactionMaxPage } = require( "../../../../../../services/user/services/wallet/services/transaction/configs" ).constants.pagination;

module.exports = {
    "userWalletForAddAmount": {
        "body": {
            "type": "object",
            "required": [ "amount" ],
            "properties": {
                "amount": { "type": "integer" }
            }
        }
    },
    "userWalletAmountPaymentCallback": {
        "query": {
            "type": "object",
            "properties": {
                "token": { "type": "string" },
                "refid": { "type": "string" },
                "clientrefid": { "type": "string" },
                "status": { "type": "integer" }
            }
        }
    },
    "userWallet_userWalletTransactionForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "userWalletUUID" ],
            "properties": {
                "userWalletUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": userWalletTransactionMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
