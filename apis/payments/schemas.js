module.exports = {
    "paymentForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "paymentUUID" ],
            "properties": {
                "paymentUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
