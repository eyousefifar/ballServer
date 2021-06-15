module.exports = {
    "sportSiteWorkPlanForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "startTime", "endTime", "genderType", "sportSiteUUID" ],
            "properties": {
                "day": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "startDay": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "endDay": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "startTime": { "type": "string", "format": "time" },
                "endTime": { "type": "string", "format": "time" },
                "genderType": { "enum": [ "مردها", "زنها" ] },
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteWorkPlanForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "day": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "startDay": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "endDay": { "enum": [ "شنبه", "یک شنبه", "دو شنبه", "سه شنبه", "چهار شنبه", "پنج شنبه", "جمعه" ] },
                "startTime": { "type": "string", "format": "time" },
                "endTime": { "type": "string", "format": "time" },
                "genderType": { "enum": [ "مردها", "زنها" ] },
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "params": {
            "type": "object",
            "required": [ "sportSiteWorkPlanUUID" ],
            "properties": {
                "sportSiteWorkPlanUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteWorkPlanForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWorkPlanUUID" ],
            "properties": {
                "sportSiteWorkPlanUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteWorkPlanForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteWorkPlanUUID" ],
            "properties": {
                "sportSiteWorkPlanUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
