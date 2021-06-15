const { rateItemNames } = require( "../../../../services/sportSite/services/rate/configs" ).constants;

module.exports = {
    "sportSiteRateForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteRateObj", "sportSiteRateItemObjs" ],
            "properties": {
                "sportSiteRateObj": {
                    "type": "object",
                    "required": [ "sportSiteUUID", "commentObj" ],
                    "properties": {
                        "sportSiteUUID": { "type": "string", "format": "uuid" },
                        "commentObj": {
                            "type": "object",
                            "required": [ "text" ],
                            "properties": {
                                "text": { "type": "string" }
                            }
                        }
                    }
                },
                "sportSiteRateItemObjs": {
                    "type": "array",
                    "maxItems": 4,
                    "minItems": 4,
                    "items": {
                        "type": "object",
                        "required": [ "itemName", "rateAmount" ],
                        "properties": {
                            "itemName": { "enum": rateItemNames },
                            "rateAmount": { "type": "number", "min": 0, "max": 5 }
                        }
                    }
                }
            }
        }
    },
    "sportSiteRateForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteRateUUID" ],
            "properties": {
                "sportSiteRateUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteRateForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteRateUUID" ],
            "properties": {
                "sportSiteRateUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "required": [ "sportSiteRateObj", "sportSiteRateItemObjs" ],
            "properties": {
                "sportSiteRateObj": {
                    "type": "object",
                    "required": [ "commentObj" ],
                    "properties": {
                        "commentObj": {
                            "type": "object",
                            "required": [ "text" ],
                            "properties": {
                                "text": { "type": "string" }
                            }
                        }
                    }
                },
                "sportSiteRateItemObjs": {
                    "type": "array",
                    "maxItems": 4,
                    "items": {
                        "type": "object",
                        "required": [ "itemName", "rateAmount" ],
                        "properties": {
                            "itemName": { "enum": rateItemNames },
                            "rateAmount": { "type": "number", "min": 0, "max": 5 }
                        }
                    }
                }
            }
        }
    }
};
