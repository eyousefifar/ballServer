module.exports = {
    "sportSiteReserveForAddByWalletPaymentTypeSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteReserveObj", "sportSiteReserveItemObjs" ],
            "properties": {
                "sportSiteReserveObj": {
                    "required": [ "sportSiteUUID" ],
                    "properties": {
                        "sportSiteUUID": { "type": "string", "format": "uuid" },
                        "discountCode": {
                            "type": "string"
                        }
                    }
                },
                "sportSiteReserveItemObjs": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [ "sportSiteSessionUUID" ],
                        "properties": {
                            "sportSiteSessionUUID": { "type": "string", "format": "uuid" },
                            "count": { "type": "integer", "min": 1 }
                        }
                    },
                    "minItems": 1,
                    "maxItems": 10
                }
            }
        }
    },
    "sportSiteReserveForAddByDirectPaymentTypeSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteReserveObj", "sportSiteReserveItemObjs" ],
            "properties": {
                "sportSiteReserveObj": {
                    "required": [ "sportSiteUUID" ],
                    "properties": {
                        "sportSiteUUID": { "type": "string", "format": "uuid" },
                        "discountCode": {
                            "type": "string"
                        }
                    }
                },
                "sportSiteReserveItemObjs": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [ "sportSiteSessionUUID" ],
                        "properties": {
                            "sportSiteSessionUUID": { "type": "string", "format": "uuid" },
                            "count": { "type": "integer", "min": 1 }
                        }
                    },
                    "minItems": 1,
                    "maxItems": 10
                }
            }
        }
    },
    "sportSiteReserveForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveUUID" ],
            "properties": {
                "sportSiteReserveUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteReserve_sportSiteReserveItemForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveUUID" ],
            "properties": {
                "sportSiteReserveUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
