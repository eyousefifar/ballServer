module.exports = {
    "sportSiteHdateForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID", "date" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" },
                "description": { "type": "string", "minLength": 5 },
                "date": { "type": "string", "format": "date" }
            }
        }
    },
    "sportSiteHdateForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteHdateUUID" ],
            "properties": {
                "sportSiteHdateUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteHdateForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteHdateUUID" ],
            "properties": {
                "sportSiteHdateUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "description": { "type": "string", "minLength": 5 }
            }
        }
    },
    "sportSiteHdateForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteHdateUUID" ],
            "properties": {
                "sportSiteHdateUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
