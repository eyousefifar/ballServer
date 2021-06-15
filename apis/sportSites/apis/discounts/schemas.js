module.exports = {
    "sportSiteDiscountForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "code", "expireDate", "capacity", "precent", "sportSiteUUID" ],
            "properties": {
                "code": { "type": "string", "minimumLength": 5 },
                "expireDate": { "type": "string" },
                "capacity": { "type": "integer", "min": 1 },
                "precent": { "type": "number", "min": 1 },
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteDiscountForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "code": { "type": "string", "minimumLength": 5 },
                "expireDate": { "type": "string", "format": "date" },
                "capacity": { "type": "integer", "min": 1 },
                "precent": { "type": "number", "min": 1 },
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "params": {
            "type": "object",
            "required": [ "sportSiteDiscountUUID" ],
            "properties": {
                "sportSiteDiscountUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteDiscountForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteDiscountUUID" ],
            "properties": {
                "sportSiteDiscountUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteDiscountForValidateAndGetByCodeSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteDiscountCode" ],
            "properties": {
                "sportSiteDiscountCode": { "type": "string" }
            }
        },
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
