const { "maxPageSize": homeMaxPage } = require( "../../services/home/configs" ).constants.pagination;

module.exports = {
    "homeForGetSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": homeMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    }
};
