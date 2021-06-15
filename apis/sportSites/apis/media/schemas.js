module.exports = {
    "sportSiteMediaForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID", "isMain", "description", "file" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" },
                "isMain": { "type": "boolean" },
                "description": { "type": "string", "minLength": 5 },
                "file": { "type": "object" }
            }
        }
    },
    "sportSiteMediaForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteMediaUUID" ],
            "properties": {
                "sportSiteMediaUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteMediaForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteMediaUUID" ],
            "properties": {
                "sportSiteMediaUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteMediaForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "isMain": { "type": "boolean" },
                "description": { "type": "string", "minLength": 5 }
            }
        }
    }
};
