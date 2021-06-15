module.exports = {
    "userWalletTransactionForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "userWalletTransactionUUID" ],
            "properties": {
                "userWalletTransactionUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
