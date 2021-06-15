require( "dotenv" ).config();
if ( !process.env.ENV ) {
    process.env.ENV = "development";
}
console.log( `app run in ${process.env.ENV} mode` );

const fastify = require( "fastify" )(),
    fastifyJwt = require( "fastify-jwt" ),
    fastifyCors = require( "fastify-cors" ),
    configs = require( "./configs.global" )( process.env ),
    setupDb = require( "./core/plugins/setupDb" ),
    setupRedisDb = require( "./core/plugins/setupRedisDb" ),
    setupLogManagerUtil = require( "./core/plugins/setupLoggerUtil" ),
    setupErrorUtil = require( "./core/plugins/setupErrorUtil" ),
    setupTokenUtil = require( "./core/plugins/setupTokenUtil" ),
    setupEmailUtil = require( "./core/plugins/setupEmailUtil" ),
    setupSmsUtil = require( "./core/plugins/setupSmsUtil" ),
    setupSequelizeOdataUtil = require( "./core/plugins/setupSequelizeOdataUtil" ),
    setupGeoUtil = require( "./core/plugins/setupGeoUtil" ),
    setupSocketServer = require( "./core/plugins/setupSocketServer" ),
    setupPaymentUtil = require( "./core/plugins/setupPaymentUtil" ),
    setupApiCachingUtil = require( "./core/plugins/setupApiCachingUtil" ),
    setupSequelizeCachingUtil = require( "./core/plugins/setupSequelizeCachingUtil" ),
    setupResourceAuthorizeUtil = require( "./core/plugins/setupResourceAuthorizeUtil" ),
    setupNotificationUtil = require( "./core/plugins/setupNotificationUtil" ),
    setupJobManagerUtil = require( "./core/plugins/setupJobManagerUtil" ),
    setupFileStorageUtil = require( "./core/plugins/setupFileStorageUtil" ),
    setupDateUtil = require( "./core/plugins/setupDateUtil" ),
    // hooks
    authenticate = require( "./core/hooks/authenticate" ),
    authorizeByRoles = require( "./core/hooks/authorizeByRoles" ),
    authorizeResource = require( "./core/hooks/authorizeResource" ),
    checkResourceExist = require( "./core/hooks/checkResourceExist" ),
    getFromApiCache = require( "./core/hooks/getFromApiCache" ),
    // services
    services = require( "./services" ),
    // apis
    apis = require( "./apis" );

fastify.register( fastifyCors, {
    "allowedHeaders": [ "Authorization", "Content-Type" ],
    "methods": [ "GET", "PUT", "POST", "DELETE" ]
} );

fastify.register( setupRedisDb, configs.redisDb[ process.env.ENV ] );

fastify.register( setupSequelizeCachingUtil, { "ttl": 60 * 60 } );

fastify.register( setupDb, { ...configs.db[ process.env.ENV ], "modelsPath": configs.constants.modelsPath, "migrationsPath": configs.constants.migrationsPath, "viewsPath": configs.constants.viewsPath, "viewModelsPath": configs.constants.viewModelsPath } );

fastify.register( setupSequelizeOdataUtil );

fastify.register( setupLogManagerUtil, { ...configs.logManagerUtil[ process.env.ENV ] } );

fastify.register( setupErrorUtil );

fastify.register( fastifyJwt, {
    "secret": configs.constants.jwtSecretKey,
    "algorithms": [ "RS256" ]
} );
    
fastify.register( setupApiCachingUtil, { "ttl": 60 * 60 } );

fastify.register( setupTokenUtil, { "jwtSecretKey": configs.constants.jwtSecretKey } );

fastify.register( setupEmailUtil, configs.emailUtil[ process.env.ENV ] );

fastify.register( setupSmsUtil, configs.smsUtil[ process.env.ENV ] );

fastify.register( setupGeoUtil );

fastify.register( setupPaymentUtil, configs.paymentUtil[ process.env.ENV ] );

fastify.register( setupResourceAuthorizeUtil, { "db": configs.db[ process.env.ENV ], "redisDb": configs.redisDb[ process.env.ENV ], "channel": 5 } );

fastify.register( setupNotificationUtil, configs.notificationUtil[ process.env.ENV ] );

fastify.register( setupJobManagerUtil, { ...configs.redisDb[ process.env.ENV ], ...configs.jobManagerUtil[ process.env.ENV ] } );

fastify.register( setupFileStorageUtil, { ...configs.fileStorageUtil[ process.env.ENV ] } );

fastify.register( setupSocketServer, { "port": configs.constants.wsServerPort } );

fastify.register( setupDateUtil );

fastify.decorate( "authenticate", authenticate );

fastify.decorate( "authorizeByRoles", authorizeByRoles );

fastify.decorate( "authorizeResource", authorizeResource );

fastify.decorate( "checkResourceExist", checkResourceExist );

fastify.decorate( "getFromApiCache", getFromApiCache );

fastify.register( services );

fastify.register( apis );

fastify.ready( ( err ) => {
    if ( err ) {
        throw err;
    }
} );

fastify.setErrorHandler( ( err, req, reply ) => {
    fastify.errorUtil.handleError( err, req, reply );
} );

fastify.listen( configs.constants.httpServerPort, configs.constants[ process.env.ENV ].serverHost, ( err, address ) => {
    if ( err ) {
        console.log( err );
    }
    fastify.log.info( `server listening on ${address}` );
} );
