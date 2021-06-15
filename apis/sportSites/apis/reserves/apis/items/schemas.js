module.exports = {
    "sportSiteReserveItemForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveItemUUID" ],
            "properties": {
                "sportSiteReserveItemUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "required": [ "sportSiteReserveItemObj" ],
            "properties": {
                "sportSiteReserveItemObj": {
                    "type": "object",
                    "required": [ "acceptStatus" ],
                    "properties": {
                        "acceptStatus": { "type": "boolean" }
                    }
                }
            }
        }
    },
    "sportSiteReserveItemForEditByCodeSchema": {
        "params": {
            "type": "object",
            "required": [ "code" ],
            "properties": {
                "code": { "type": "string" }
            }
        },
        "body": {
            "type": "object",
            "required": [ "sportSiteReserveItemObj" ],
            "properties": {
                "sportSiteReserveItemObj": {
                    "type": "object",
                    "required": [ "acceptStatus" ],
                    "properties": {
                        "acceptStatus": { "type": "boolean" }
                    }
                }
            }
        }
    },
    "sportSiteReserveItemForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveItemUUID" ],
            "properties": {
                "sportSiteReserveItemUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteReserveItemForCheckSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveItemUUID" ],
            "properties": {
                "sportSiteReserveItemUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteReserveItemForCheckByCodeSchema": {
        "params": {
            "type": "object",
            "required": [ "code" ],
            "properties": {
                "code": { "type": "string" }
            }
        }
    },
    "sportSiteReserveItemForGetCardSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveItemUUID" ],
            "properties": {
                "sportSiteReserveItemUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteReserveItemForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteReserveItemUUID" ],
            "properties": {
                "sportSiteReserveItemUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
