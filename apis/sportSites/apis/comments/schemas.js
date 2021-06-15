module.exports = {
    "sportSiteCommentForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID", "text" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" },
                "replyCommentUUID": { "type": "string", "format": "uuid" },
                "text": { "type": "string", "minLength": 5 }
            }
        }
    },
    "sportSiteCommentForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteCommentUUID" ],
            "properties": {
                "sportSiteCommentUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "required": [ "confirmStatus" ],
            "properties": {
                "confirmStatus": { "type": "boolean" }
            }
        }
    },
    "sportSiteCommentForRemoveSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteCommentUUID" ],
            "properties": {
                "sportSiteCommentUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteCommentForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteCommentUUID" ],
            "properties": {
                "sportSiteCommentUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
