const { appEndpoint } = require( "../../../../configs.global" )( process.env ).constants[ process.env.ENV ];

module.exports = {
    "constants": {
        "providerPrecent": 80,
        "pagination": {
            "maxPageSize": 40
        },
        "paymentCallbackUrl": `${appEndpoint}/static-files/htmls/paymentCallback.html?type=reserve`
    }
};

