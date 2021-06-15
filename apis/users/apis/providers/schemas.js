const { userForEditSchema_provider_customer } = require( "../../schemas" ),
    { "maxPageSize": sportSiteMaxPage } = require( "../../../../services/sportSite/configs" ).constants.pagination;

module.exports = {
    "providerForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "userUUID", "isin", "fatherName", "homeTelphone" ],
            "properties": {
                "userUUID": { "type": "string", "format": "uuid" },
                "isin": { "type": "string" },
                "fatherName": { "type": "string" },
                "homeTelphone": { "type": "string" }
            }
        }
    },
    "providerForEditSchema": {
        "body": {
            "userObj": userForEditSchema_provider_customer,
            "isin": { "type": "string" },
            "fatherName": { "type": "string" },
            "homeTelphone": { "type": "string" }
        }
    },
    "provider_providerSportSiteForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
