module.exports = ( env ) =>
    ( {
        "constants": {
            "development": {
                "appEndpoint": env.DEVELOPMENT_APP_MAIN_ENDPOINT,
                "serverHost": env.DEVELOPMENT_SERVER_HOST
            },
            "production": {
                "appEndpoint": env.PRODUCTION_APP_MAIN_ENDPOINT,
                "serverHost": env.PRODUCTION_SERVER_HOST
            },
            "wsServerPort": env.WS_SERVER_PORT,
            "httpServerPort": env.HTTP_SERVER_PORT,
            "jwtSecretKey": env.JWT_SECRET_KEY,
            "modelsPath": `${process.cwd()}/data/models/`,
            "migrationsPath": `${process.cwd()}/data/migrations/`,
            "viewsPath": `${process.cwd()}/core/database/views`,
            "viewModelsPath": `${process.cwd()}/data/views/`
        },
        "db": {
            "development": {
                "dbName": env.DEVELOPMENT_DATABASE_NAME,
                "userName": env.DEVELOPMENT_DATABASE_USERNAME,
                "password": env.DEVELOPMENT_DATABASE_PASSWORD,
                "host": env.DEVELOPMENT_DATABASE_HOST,
                "port": env.DEVELOPMENT_DATABASE_PORT,
                "dialect": env.DEVELOPMENT_DATABASE_DIALECT,
                "dialectOptions": {
                    "useUTC": false
                },
                "timezone": "+03:30",
                "pool": {
                    "max": 100,
                    "min": 0
                },
                "logging": console.log
            },
            "production": {
                "dbName": env.PRODUCTION_DATABASE_NAME,
                "userName": env.PRODUCTION_DATABASE_USERNAME,
                "password": env.PRODUCTION_DATABASE_PASSWORD,
                "host": env.PRODUCTION_DATABASE_HOST,
                "port": env.PRODUCTION_DATABASE_PORT,
                "dialect": env.PRODUCTION_DATABASE_DIALECT,
                "dialectOptions": {
                    "useUTC": false
                },
                "timezone": "+03:30",
                "pool": {
                    "max": 200,
                    "min": 0
                }
            }
        },
        "redisDb": {
            "development": {
                "host": env.DEVELOPMENT_REDIS_DATABASE_HOST,
                "port": env.DEVELOPMENT_REDIS_DATABASE_PORT,
                "password": env.DEVELOPMENT_REDIS_DATABASE_PASSWORD
            },
            "production": {
                "host": env.PRODUCTION_REDIS_DATABASE_HOST,
                "port": env.PRODUCTION_REDIS_DATABASE_PORT,
                "password": env.PRODUCTION_REDIS_DATABASE_PASSWORD
            }
        },
        "paymentUtil": {
            "development": {
                "mode": env.DEVELOPMENT_PAYMENT_MODE,
                "payirApiKey": env.DEVELOPMENT_PAYIR_APIKEY,
                "payirSendEndPoint": env.PAYIR_SEND_ENDPOINT,
                "payirVerifyEndPoint": env.PAYIR_VERIFY_ENDPOINT,
                "payirGatewayEndPoint": env.PAYIR_GATEWAY_ENDPOINT,
                "paypingApiKey": env.DEVELOPMENT_PAYPING_APIKEY,
                "paypingSendEndPoint": env.PAYPING_SEND_ENDPOINT,
                "paypingVerifyEndPoint": env.PAYPING_VERIFY_ENDPOINT,
                "paypingGatewayEndPoint": env.PAYPING_GATEWAY_ENDPOINT
            },
            "production": {
                "mode": env.PRODUCTION_PAYMENT_MODE,
                "payirApiKey": env.PRODUCTION_PAYIR_APIKEY,
                "payirSendEndPoint": env.PAYIR_SEND_ENDPOINT,
                "payirVerifyEndPoint": env.PAYIR_VERIFY_ENDPOINT,
                "payirGatewayEndPoint": env.PAYIR_GATEWAY_ENDPOINT,
                "paypingApiKey": env.PRODUCTION_PAYPING_APIKEY,
                "paypingSendEndPoint": env.PAYPING_SEND_ENDPOINT,
                "paypingVerifyEndPoint": env.PAYPING_VERIFY_ENDPOINT,
                "paypingGatewayEndPoint": env.PAYPING_GATEWAY_ENDPOINT
            }
        },
        "smsUtil": {
            "development": {
                "mode": env.DEVELOPMENT_SMSUTIL_MODE,
                "kavehnegarApiKey": env.DEVELOPMENT_KAVEHNEGAR_APIKEY,
                "ghasedakApiKey": env.DEVELOPMENT_GHASEDAK_APIKEY,
                "kavehnegarVerifyEndPoint": `https://api.kavenegar.com/v1/${env.DEVELOPMENT_KAVEHNEGAR_APIKEY}/verify/lookup.json`,
                "ghasedakVerifyEndPoint": "https://api.ghasedak.io/v2/verification/send/simple"
            },
            "production": {
                "mode": env.PRODUCTION_SMSUTIL_MODE,
                "kavehnegarApiKey": env.PRODUCTION_KAVEHNEGAR_APIKEY,
                "ghasedakApiKey": env.PRODUCTION_GHASEDAK_APIKEY,
                "kavehnegarVerifyEndPoint": `https://api.kavenegar.com/v1/${env.PRODUCTION_KAVEHNEGAR_APIKEY}/verify/lookup.json`,
                "ghasedakVerifyEndPoint": "https://api.ghasedak.io/v2/verification/send/simple"
            }
        },
        "emailUtil": {
            "development": {
                "host": env.DEVELOPMENT_EMAIL_SERVICE_HOST,
                "port": env.DEVELOPMENT_EMAIL_SERVICE_PORT,
                "secureStatus": env.DEVELOPMENT_EMAIL_SERVICE_SECURE_STATUS,
                "userName": env.DEVELOPMENT_EMAIL_SERVICE_USER_NAME,
                "password": env.DEVELOPMENT_EMAIL_SERVICE_PASSWORD,
                "from": env.DEVELOPMENT_EMAIL_SERVICE_FROM
            },
            "production": {
                "host": env.PRODUCTION_EMAIL_SERVICE_HOST,
                "port": env.PRODUCTION_EMAIL_SERVICE_PORT,
                "secureStatus": env.PRODUCTION_EMAIL_SERVICE_SECURE_STATUS,
                "userName": env.PRODUCTION_EMAIL_SERVICE_USER_NAME,
                "password": env.PRODUCTION_EMAIL_SERVICE_PASSWORD,
                "from": env.PRODUCTION_EMAIL_SERVICE_FROM
            }
        },
        "notificationUtil": {
            "development": {
                "mode": env.DEVELOPMENT_NOTIFICATION_MODE,
                "poosheApiKey": env.DEVELOPMENT_POOSHE_APIKEY,
                "poosheSendEndPoint": env.POOSHE_SEND_ENDPOINT,
                "poosheAppIds": [ env.POOSHE_APP_ID ]
            },
            "production": {
                "mode": env.PRODUCTION_NOTIFICATION_MODE,
                "poosheApiKey": env.PRODUCTION_POOSHE_APIKEY,
                "poosheSendEndPoint": env.POOSHE_SEND_ENDPOINT,
                "poosheAppIds": [ env.POOSHE_APP_ID ]
            }
        },
        "fileStorageUtil": {
            "development": {
                "mode": env.DEVELOPMENT_FILESTORAGE_MODE,
                "minioHost": env.DEVELOPMENT_MINIO_FILESTORAGE_HOST,
                "minioAccessFileEndpoint": env.DEVELOPMENT_MINIO_FILESTORAGE_ACCESS_FILE_ENDPOINT,
                "localAccessFileEndpoint": env.DEVELOPMENT_LOCAL_FILESTORAGE_ACCESS_FILE_ENDPOINT,
                "minioPort": env.DEVELOPMENT_MINIO_FILESTORAGE_PORT,
                "minioAccessKey": env.DEVELOPMENT_MINIO_FILESTORAGE_ACCESSKEY,
                "minioSecretKey": env.DEVELOPMENT_MINIO_FILESTORAGE_SECRETKEY,
                "minioDestFileLocationObjs": [
                    {
                        "destFileLocation": "sport-sites",
                        "policy": "ReadOnly"
                    },
                    {
                        "destFileLocation": "user-profile",
                        "policy": "ReadOnly"
                    }
                ]
            },
            "production": {
                "mode": env.PRODUCTION_FILESTORAGE_MODE,
                "minioHost": env.PRODUCTION_MINIO_FILESTORAGE_HOST,
                "minioAccessFileEndpoint": env.PRODUCTION_MINIO_FILESTORAGE_ACCESS_FILE_ENDPOINT,
                "localAccessFileEndpoint": env.PRODUCTION_LOCAL_FILESTORAGE_ACCESS_FILE_ENDPOINT,
                "minioPort": env.PRODUCTION_MINIO_FILESTORAGE_PORT,
                "minioAccessKey": env.PRODUCTION_MINIO_FILESTORAGE_ACCESSKEY,
                "minioSecretKey": env.PRODUCTION_MINIO_FILESTORAGE_SECRETKEY,
                "minioDestFileLocationObjs": [
                    {
                        "destFileLocation": "sport-sites",
                        "policy": "ReadOnly"
                    },
                    {
                        "destFileLocation": "user-profile",
                        "policy": "ReadOnly"
                    },
                    {
                        "destFileLocation": "baner",
                        "policy": "ReadOnly"
                    }
                ]
            }
        },
        "jobManagerUtil": {
            "development": {
                "mode": env.DEVELOPMENT_JOBMANAGER_MODE,
                "queueNames": [ "ball_track_customers", "ball_send_notification", "ball_send_verify_email", "ball_send_verify_sms", "ball_send_reset_password_email" ]
            },
            "production": {
                "mode": env.PRODUCTION_JOBMANAGER_MODE,
                "queueNames": [ "ball_track_customers", "ball_send_notification", "ball_send_verify_email", "ball_send_verify_sms", "ball_send_reset_password_email" ]
            }
        },
        "logManagerUtil": {
            "development": {
                "mode": env.DEVELOPMENT_LOGMANAGER_MODE
            },
            "production": {
                "mode": env.PRODUCTION_LOGMANAGER_MODE
            }
        }
    } );
