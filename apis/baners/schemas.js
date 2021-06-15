const { "maxPageSize": banerMaxPage } = require( "../../services/baner/configs" ).constants;

module.exports = {
    "banerForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "description" ],
            "properties": {
                "description": { "type": "string" },
                "accessLink": { "type": "string", "minLength": 5 }
            }
        }
    },
    "banerForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "banerUUID" ],
            "properties": {
                "banerUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "banerForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": banerMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "banerForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "banerUUID" ],
            "properties": {
                "banerUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "description": { "type": "string" },
                "accessLink": { "type": "string", "minLength": 5 }
            }
        }
    },
    "banerForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "banerUUID" ],
            "properties": {
                "banerUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
