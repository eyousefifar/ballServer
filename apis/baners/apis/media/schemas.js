module.exports = {
    "banerMediaForAdd": {
        "body": {
            "type": "object",
            "required": [ "file" ],
            "properties": {
                "file": { "type": "object" }
            }
        }
    },
    "banerMediaForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "banerMediaUUID" ],
            "properties": {
                "banerMediaUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "banerMediaForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "banerMediaUUID" ],
            "properties": {
                "banerMediaUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "banerMediaForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "isMain": { "type": "boolean" },
                "description": { "type": "string", "minLength": 5 }
            }
        }
    }
};
