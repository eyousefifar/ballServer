module.exports = {
    "sportSiteSessionDiscountForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "expireDate", "precent", "sportSiteSessionUUID" ],
            "properties": {
                "expireDate": { "type": "string" },
                "precent": { "type": "number", "min": 1 },
                "sportSiteSessionUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSessionDiscountForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "expireDate": { "type": "string", "format": "date" },
                "precent": { "type": "number", "min": 1 }
            }
        },
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionDiscountUUID" ],
            "properties": {
                "sportSiteSessionDiscountUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSessionDiscountForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionDiscountUUID" ],
            "properties": {
                "sportSiteSessionDiscountUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
