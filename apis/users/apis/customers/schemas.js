const { userForEditSchema_provider_customer } = require( "../../schemas" ),
    { "maxPageSize": sportSiteLikeMaxPage } = require( "../../../../services/sportSite/services/like/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSupportTicketMaxPage } = require( "../../../../services/sportSite/services/supportTicket/configs" ).constants.pagination,
    { "maxPageSize": sportSiteRateMaxPage } = require( "../../../../services/sportSite/services/rate/configs" ).constants.pagination,
    { "maxPageSize": paymentMaxPage } = require( "../../../../services/payment/configs" ).constants.pagination,
    { "maxPageSize": creditMaxPage } = require( "../../../../services/user/services/credit/configs" ).constants.pagination,
    { "maxPageSize": sportSiteReserveMaxPage } = require( "../../../../services/sportSite/services/reserve/configs" ).constants.pagination;

module.exports = {
    "customerForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "bodyInfo", "userUUID" ],
            "properties": {
                "userUUID": { "type": "string", "format": "uuid" },
                "bodyInfo": { "type": "object" }
            }
        }
    },
    "customerForEditSchema": {
        "body": {
            "type": "object",
            "properties": {
                "userObj": userForEditSchema_provider_customer,
                "bodyInfo": { "type": "object" }
            }
        }
    },
    "customer_reserveItemCardForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteReserveMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "customer_likeForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteLikeMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "customer_rateForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteRateMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "customer_ownSportSiteRateSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": {
                    "type": "string",
                    "format": "uuid"
                }
            }
        }
    },
    "customer_supportTicketForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteSupportTicketMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "customer_paymentForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": paymentMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "admin_customer_customerCreditForGetAll": {
        "params": {
            "type": "object",
            "required": [ "userUUID" ],
            "properties": {
                "userUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
