const { "maxPageSize": notificationMaxPage } = require( "../../services/notification/configs" ).constants.pagination;

module.exports = {
    "userForAddSchema_admin": {
        "body": {
            "type": "object",
            "required": [ "name", "types" ],
            "properties": {
                "name": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "emailConfirm": { "type": "boolean" },
                "profilePicUrl": { "type": "string" },
                "phone": { "type": "string" },
                "password": { "type": "string", "minimum": 6 },
                "types": { "type": "array", "items": { "enum": [ "customer", "provider", "providerAssistant", "admin" ] } }
            }
        }
    },
    "userForAddSchema_provider_customer": {
        "body": {
            "type": "object",
            "required": [ "name", "types" ],
            "properties": {
                "name": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "phone": { "type": "string" },
                "password": { "type": "string", "minimum": 6 }
            }
        }
    },
    "userForEditSchema_admin": {
        "body": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "emailConfirm": { "type": "boolean" },
                "profilePicUrl": { "type": "string" },
                "phone": { "type": "string" },
                "password": { "type": "string", "minimum": 6 },
                "types": { "type": "array", "items": { "enum": [ "customer", "provider", "providerAssistant", "admin" ] } }
            }
        }
    },
    "userForEditSchema_provider_customer": {
        "body": {
            "type": "object",
            "properties": {
                "name": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "phone": { "type": "string" },
                "password": { "type": "string", "minimum": 6 }
            }
        }
    },
    "user_notificationForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": notificationMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
