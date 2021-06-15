module.exports = {
    "sportSiteSupportTicketCommentForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteSupportTicketUUID", "text" ],
            "properties": {
                "sportSiteSupportTicketUUID": { "type": "string", "format": "uuid" },
                "replyCommentUUID": { "type": "string", "format": "uuid" },
                "text": { "type": "string" }
            }
        }
    },
    "sportSiteSupportTicketCommentForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSupportTicketCommentUUID" ],
            "properties": {
                "sportSiteSupportTicketCommentUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "sportSiteSupportTicketUUID": { "type": "string", "format": "uuid" },
                "text": { "type": "string" }
            }
        }
    },
    "sportSiteSupportTicketCommentForGet": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSupportTicketCommentUUID" ],
            "properties": {
                "sportSiteSupportTicketCommentUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
