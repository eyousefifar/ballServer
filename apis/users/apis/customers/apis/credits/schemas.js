module.exports = {
    "customerCreditForAdd": {
        "body": {
            "type": "object",
            "required": [ "userUUID", "amount", "creditUsageLimit", "creditAmountPerUsage" ],
            "properties": {
                "userUUID": { "type": "string", "format": "uuid" },
                "creditUsageLimit": { "type": "integer", "min": 1 },
                "creditAmountPerUsage": { "type": "integer", "min": 1 },
                "amount": { "type": "integer", "min": 1 }
            }
        }
    },
    "customerCreditForGet": {
        "params": {
            "type": "object",
            "required": [ "customerCreditUUID" ],
            "properties": {
                "customerCreditUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "customerCreditForEdit": {
        "params": {
            "type": "object",
            "required": [ "customerCreditUUID" ],
            "properties": {
                "customerCreditUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "creditUsageLimit": { "type": "integer", "min": 1 },
                "creditAmountPerUsage": { "type": "integer", "min": 1 },
                "amount": { "type": "integer", "min": 1 }
            }
        }
    }
};
