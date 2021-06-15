module.exports = {
    "sportSiteSessionTimeForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "startTime", "endTime", "sportSiteUUID" ],
            "properties": {
                "startTime": { "type": "string", "format": "time" },
                "endTime": { "type": "string", "format": "time" },
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSessionTimeForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionTimeUUID" ],
            "properties": {
                "sportSiteSessionTimeUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "startTime": { "type": "string", "format": "time" },
                "endTime": { "type": "string", "format": "time" }
            }
        }
    },
    "sportSiteSessionTimeForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionTimeUUID" ],
            "properties": {
                "sportSiteSessionTimeUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSessionTime_sportSiteSessionForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionTimeUUID" ],
            "properties": {
                "sportSiteSessionTimeUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
