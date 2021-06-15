const { "maxPageSize": sportSiteWalletTransactionMaxPage } = require( "../../../../services/sportSite/services/wallet/services/transaction/configs" ).constants.pagination;

module.exports = {
    "sportSiteWalletForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWalletUUID" ],
            "properties": {
                "sportSiteWalletUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteWallet_sportSiteWalletTransactionForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWalletUUID" ],
            "properties": {
                "sportSiteWalletUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteWalletTransactionMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSiteWallet_sportSiteWalletTransactionIncAndDecAmountForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWalletUUID" ],
            "properties": {
                "sportSiteWalletUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "odataStr": { "type": "string" }
            }
        }
    }
};
