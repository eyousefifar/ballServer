const { "maxPageSize": supportTicketCommentMaxPageSize } = require( "../../../../services/sportSite/services/supportTicket/services/supportTicketComment/configs" ).constants.pagination,
    { sportSiteSupportTicketTypes } = require( "../../../../services/sportSite/services/supportTicket/configs" ).constants;

module.exports = {
    "sportSiteSupportTicketForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" },
                "type": { "enum": sportSiteSupportTicketTypes }
            }
        }
    },
    "sportSiteSupportTicketForGet": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSupportTicketUUID" ],
            "properties": {
                "sportSiteSupportTicketUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteSupportTicket_sportSiteSupportTicketCommentForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteSupportTicketUUID" ],
            "properties": {
                "sportSiteSupportTicketUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": supportTicketCommentMaxPageSize },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
