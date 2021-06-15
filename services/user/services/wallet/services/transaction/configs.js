const { appEndpoint } = require( "../../../../../../configs.global" )( process.env ).constants[ process.env.ENV ];

module.exports = {
    "constants": {
        "paymentCallbackUrl": `${appEndpoint}/static-files/htmls/paymentCallback.html?type=wallet`,
        "pagination": {
            "maxPageSize": 40
        }
    }
};

