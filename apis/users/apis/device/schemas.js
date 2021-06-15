module.exports = {
    "userDeviceForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "deviceToken" ],
            "properties": {
                "deviceToken": {
                    "type": "string"
                },
                "deviceInfo": {
                    "type": "object"
                }
            }
        }
    },
    "userDeviceForEditSchema": {
        "body": {
            "deviceToken": {
                "type": "string"
            },
            "deviceInfo": {
                "type": "object"
            }
        }
    }
};
