const { "maxPageSize": reserveItemMaxPageSize } = require( "../../../../services/sportSite/services/reserve/services/reserveItem/configs" ).constants.pagination,
    { sportTypes, genderTypes, qualitySessionTypes, adultSessionType } = require( "../../../../services/sportSite/configs" ).constants;

module.exports = {
    "sportSiteSessionForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "capacity", "price", "genderType", "sportType", "sessionTimeUUID" ],
            "properties": {
                "date": { "type": "string", "format": "date" },
                "capacity": { "type": "integer", "min": 1 },
                "price": { "type": "integer", "min": 0 },
                "genderType": { "enum": genderTypes },
                "sportType": { "enum": sportTypes },
                "adultType": { "enum": adultSessionType },
                "qualityType": { "enum": qualitySessionTypes },
                "information": { "type": "object" },
                "sessionTimeUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSessionForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionUUID" ],
            "properties": {
                "sportSiteSessionUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "date": { "type": "string", "format": "date" },
                "capacity": { "type": "integer", "min": 1 },
                "price": { "type": "integer", "min": 0 },
                "genderType": { "enum": genderTypes },
                "sportType": { "enum": sportTypes },
                "adultType": { "enum": adultSessionType },
                "qualityType": { "enum": qualitySessionTypes },
                "information": { "type": "object" },
                "sessionTimeUUID": { "type": "string", "format": "uuid" },
                "enableStatus": { "type": "boolean" }
            }
        }
    },
    "sportSiteSessionForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionUUID" ],
            "properties": {
                "sportSiteSessionUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSession_reserveItemForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSessionUUID" ],
            "properties": {
                "sportSiteSessionUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": reserveItemMaxPageSize },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
