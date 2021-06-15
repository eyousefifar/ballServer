module.exports = {
    "providerAssistantForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteOwnerUUID" ],
            "properties": {
                "sportSiteOwnerUUID": { "type": "number", "minimum": 1 }
            }
        }
    },
    "providerAssistant_providerAssistantForEditForSchema": {
        "body": {
            "type": "object",
            "required": [ "acceptStatus" ],
            "properties": {
                "sportSiteUUID": { "type": "boolean" }
            }
        }
    },
    "providerAssistantForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "providerAssistantUUID": { "type": "number", "minimum": 1 }
            }
        }
    }
};
