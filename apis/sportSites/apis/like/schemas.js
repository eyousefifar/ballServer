module.exports = {
    "sportSiteLikeForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteLikeForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteLikeUUID" ],
            "properties": {
                "sportSiteLikeUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteLikeForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteLikeUUID" ],
            "properties": {
                "sportSiteLikeUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
