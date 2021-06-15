module.exports = {
    "sportSiteWalletTransactionForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWalletTransactionUUID" ],
            "properties": {
                "sportSiteWalletTransactionUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
