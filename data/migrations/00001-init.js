"use strict";

let Sequelize = require( "sequelize" );

/**
 * Actions summary:
 *
 * createTable "Address", deps: []
 * createTable "Baner", deps: []
 * createTable "DiscountPrivate", deps: []
 * createTable "DiscountPublic", deps: []
 * createTable "Media", deps: []
 * createTable "Payment", deps: []
 * createTable "ProviderAssistantResourcePermission", deps: []
 * createTable "SportSiteComplex", deps: []
 * createTable "SportSiteType", deps: []
 * createTable "SupportTicket", deps: []
 * createTable "User", deps: []
 * createTable "UserDevice", deps: []
 * createTable "UserShare", deps: []
 * createTable "Wallet", deps: []
 * createTable "Comment", deps: [User, Comment]
 * createTable "Customer", deps: [User]
 * createTable "CustomerCredit", deps: [Customer]
 * createTable "UserUseDiscountPrivate", deps: [Customer, DiscountPrivate]
 * createTable "SportSite", deps: [User, Address, SportSiteComplex]
 * createTable "Like", deps: [User]
 * createTable "Notification", deps: [User]
 * createTable "Provider", deps: [User]
 * createTable "ProviderAssistant", deps: [User]
 * createTable "Rate", deps: [User, Comment]
 * createTable "RateItem", deps: [Rate]
 * createTable "Hdate", deps: [SportSite]
 * createTable "WalletTransaction", deps: [Payment, Wallet]
 * createTable "SessionTime", deps: [SportSite]
 * createTable "Reserve", deps: [Payment, WalletTransaction, User, SportSite]
 * createTable "Session", deps: [SessionTime]
 * createTable "SportType", deps: [SportSiteType]
 * createTable "ReserveItem", deps: [Session, Reserve]
 * createTable "WorkPlan", deps: [SportSite]
 * createTable "Log", deps: []
 * addIndex "hdate_sport_site_u_u_i_d_date" to table "Hdate"
 * addIndex "like_owner_resource_u_u_i_d_user_u_u_i_d" to table "Like"
 * addIndex "rate_owner_resource_u_u_i_d_user_u_u_i_d" to table "Rate"
 * addIndex "rate_item_rate_u_u_i_d_item_name" to table "RateItem"
 * addIndex "session_session_time_u_u_i_d_date_sport_type_adult_type_quality_type" to table "Session"
 * addIndex "session_time_sport_site_u_u_i_d_start_time_end_time" to table "SessionTime"
 * addIndex "work_plan_day_start_day_end_day_start_time_end_time_gender_type_sport_site_u_u_i_d" to table "WorkPlan"
 **/

let info = {
    "revision": 1,
    "name": "noname",
    "created": "2019-11-16T12:40:14.550Z",
    "comment": ""
};

let migrationCommands = [ {
    "fn": "createTable",
    "params": [
        "Address",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "city": {
                "type": Sequelize.ENUM( "قم" ),
                "allowNull": false
            },
            "area": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "descriptiveAddress": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "coordinateAddress": {
                "type": Sequelize.ARRAY( Sequelize.DOUBLE ),
                "unique": true,
                "allowNull": true
            },
            "postalCode": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": true
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Baner",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "description": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "accessLink": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "mainPicUrl": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "DiscountPrivate",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "capacity": {
                "type": Sequelize.INTEGER,
                "allowNull": false
            },
            "code": {
                "type": Sequelize.STRING,
                "allowNull": false,
                "unique": true
            },
            "precent": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "expireDate": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "enableStatus": {
                "type": Sequelize.BOOLEAN,
                "allowNull": false,
                "defaultValue": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "DiscountPublic",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "precent": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "expireDate": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Media",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "destFileName": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "destFileLocation": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "destFileMimeType": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "destFileUrl": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "size": {
                "type": Sequelize.JSONB,
                "allowNull": true
            },
            "isMain": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "description": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Payment",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "amount": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "cardNumber": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "factorNumber": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "transactionId": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "status": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "paymentType": {
                "type": Sequelize.ENUM( "شارژ کیف پول", "رزرو مستقیم" ),
                "allowNull": false
            },
            "description": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "ProviderAssistantResourcePermission",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "resourceName": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "action": {
                "type": Sequelize.ENUM( "add", "read", "edit", "remove", "all" ),
                "allowNull": false
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SportSiteComplex",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": false
            },
            "sportSiteTypes": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "استخر", "سالن سرپوشیده", "چمن مصنوعی", "اتاق فرار" ) ),
                "allowNull": true
            },
            "sportTypes": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "شنا", "فوتبال", "فوتسال", "والیبال", "بسکتبال", "بولینگ", "بدن سازی", "پینت بال", "اتاق فرار" ) ),
                "allowNull": true
            },
            "genderTypes": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "زن", "مرد" ) ),
                "allowNull": true
            },
            "description": {
                "type": Sequelize.TEXT,
                "allowNull": true
            },
            "rateAvg": {
                "type": Sequelize.DOUBLE,
                "defaultValue": 0,
                "allowNull": false
            },
            "likeCount": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "maxDiscountPrecent": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "minPrice": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "mainPicUrl": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "enableStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "confirmationStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SportSiteType",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SupportTicket",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "status": {
                "type": Sequelize.ENUM( "در انتظار پاسخ", "پاسخ داده شده", "بسته شده" ),
                "allowNull": false,
                "defaultValue": "در انتظار پاسخ"
            },
            "type": {
                "type": Sequelize.ENUM( "پیشنهاد", "مشکل" ),
                "allowNull": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "User",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "types": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "customer", "provider", "providerAssistant", "admin" ) ),
                "allowNull": true
            },
            "name": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "email": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": true
            },
            "emailConfirm": {
                "type": Sequelize.BOOLEAN,
                "allowNull": true
            },
            "password": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "phone": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": true
            },
            "profilePicUrl": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "UserDevice",
        {
            "deviceToken": {
                "type": Sequelize.STRING,
                "primaryKey": true
            },
            "deviceInfo": {
                "type": Sequelize.JSONB,
                "allowNull": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "UserShare",
        {
            "shareCode": {
                "type": Sequelize.STRING,
                "allowNull": false,
                "primarykey": true
            },
            "destUserUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "status": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false
            },
            "originUserDeviceRegisterToken": {
                "type": Sequelize.STRING,
                "primaryKey": true
            },
            "originUserUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Wallet",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "amount": {
                "type": Sequelize.DOUBLE,
                "defaultValue": 0,
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Comment",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "text": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "confirmStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "hasRepliedComments": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "userType": {
                "type": Sequelize.ENUM( "admin", "provider", "customer", "providerAssistant" ),
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "replyCommentUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "Comment",
                    "key": "uuid"
                },
                "allowNull": true
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Customer",
        {
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": true,
                "primaryKey": true
            },
            "bodyInfo": {
                "type": Sequelize.JSONB,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "CustomerCredit",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "amount": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "creditUsageLimit": {
                "type": Sequelize.INTEGER,
                "defaultValue": 1,
                "allowNull": false
            },
            "creditAmountPerUsage": {
                "type": Sequelize.INTEGER,
                "defaultValue": 1,
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "Customer",
                    "key": "userUUID"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "UserUseDiscountPrivate",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "Customer",
                    "key": "userUUID"
                },
                "allowNull": false
            },
            "discountPrivateUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "DiscountPrivate",
                    "key": "uuid"
                },
                "allowNull": true
            },
            "useStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": true,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SportSite",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "tel": {
                "type": Sequelize.ARRAY( Sequelize.STRING ),
                "unique": true,
                "allowNull": false
            },
            "description": {
                "type": Sequelize.TEXT,
                "allowNull": true
            },
            "playgroundInformation": {
                "type": Sequelize.JSONB,
                "allowNull": false
            },
            "type": {
                "type": Sequelize.ENUM( "استخر", "سالن سرپوشیده", "چمن مصنوعی", "اتاق فرار", "سالن ماساژ" ),
                "allowNull": false
            },
            "sportTypes": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "شنا", "فوتبال", "فوتسال", "والیبال", "بسکتبال", "بولینگ", "بدن سازی", "پینت بال", "اتاق فرار", "ماساژ" ) ),
                "allowNull": true
            },
            "genderTypes": {
                "type": Sequelize.ARRAY( Sequelize.ENUM( "زن", "مرد" ) ),
                "allowNull": false
            },
            "rateCount": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "rateAvg": {
                "type": Sequelize.DOUBLE,
                "defaultValue": 0,
                "allowNull": false
            },
            "maxDiscountPrecent": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "maxDiscountExpireDate": {
                "type": Sequelize.DATE,
                "allowNull": true
            },
            "minPrice": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "mainPicUrl": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "enableStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": true,
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "addressUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "Address",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "sportSiteComplexUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "SportSiteComplex",
                    "key": "uuid"
                },
                "allowNull": true
            },
            "sessionTimeInHour": {
                "type": Sequelize.DOUBLE,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Like",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Provider",
        {
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": true,
                "primaryKey": true
            },
            "isin": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "fatherName": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "homeTelphone": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "ProviderAssistant",
        {
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": true,
                "primaryKey": true
            },
            "acceptStatus": {
                "type": Sequelize.BOOLEAN,
                "allowNull": false,
                "defaultValue": false
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Rate",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "rateAmount": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "commentUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "Comment",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "RateItem",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "itemName": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "rateAmount": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "rateUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "Rate",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Hdate",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "date": {
                "type": Sequelize.DATEONLY,
                "allowNull": false
            },
            "description": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "SportSite",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "WalletTransaction",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "amount": {
                "type": Sequelize.DOUBLE,
                "allowNull": false
            },
            "transactionType": {
                "type": Sequelize.ENUM( "inc", "dec" ),
                "allowNull": false
            },
            "description": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "paymentUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "Payment",
                    "key": "uuid"
                },
                "allowNull": true
            },
            "walletUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "Wallet",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SessionTime",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "startTime": {
                "type": Sequelize.TIME,
                "allowNull": false
            },
            "endTime": {
                "type": Sequelize.TIME,
                "allowNull": false
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "SportSite",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Reserve",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "totalItemsPrice": {
                "type": Sequelize.INTEGER,
                "allowNull": false
            },
            "finalPrice": {
                "type": Sequelize.INTEGER,
                "allowNull": false
            },
            "totalDiscountPrecent": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "submitStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "acceptStatus": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false,
                "allowNull": false
            },
            "paymentUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "Payment",
                    "key": "uuid"
                },
                "unique": true,
                "allowNull": true
            },
            "walletTransactionUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "WalletTransaction",
                    "key": "uuid"
                },
                "unique": true,
                "allowNull": true
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "SportSite",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Session",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "date": {
                "type": Sequelize.DATEONLY,
                "allowNull": true
            },
            "isDynamic": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": false
            },
            "isMultiUse": {
                "type": Sequelize.BOOLEAN,
                "defaultValue": true
            },
            "validDateRangeInDay": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "capacity": {
                "type": Sequelize.INTEGER,
                "allowNull": false
            },
            "price": {
                "type": Sequelize.INTEGER,
                "allowNull": false
            },
            "discountPrecent": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "discountExpireDate": {
                "type": Sequelize.DATE,
                "allowNull": true
            },
            "reservesCount": {
                "type": Sequelize.INTEGER,
                "defaultValue": 0,
                "allowNull": false
            },
            "genderType": {
                "type": Sequelize.ENUM( "مرد", "زن" ),
                "allowNull": true
            },
            "sportType": {
                "type": Sequelize.ENUM( "شنا", "فوتبال", "فوتسال", "والیبال", "بسکتبال", "بولینگ", "بدن سازی", "پینت بال", "اتاق فرار" ),
                "allowNull": true
            },
            "adultType": {
                "type": Sequelize.ENUM( "بزرگسال", "خردسال" ),
                "allowNull": true
            },
            "qualityType": {
                "type": Sequelize.ENUM( "ویژه", "معمولی" ),
                "allowNull": true
            },
            "information": {
                "type": Sequelize.JSONB,
                "allowNull": true
            },
            "enableStatus": {
                "type": Sequelize.BOOLEAN,
                "allowNull": false,
                "defaultValue": false
            },
            "lockAt": {
                "type": Sequelize.DATE,
                "allowNull": true
            },
            "sessionTimeUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "SessionTime",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "SportType",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "sportSiteTypeUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "SportSiteType",
                    "key": "uuid"
                },
                "allowNull": true
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "ReserveItem",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "primaryKey": true,
                "defaultValue": Sequelize.UUIDV4
            },
            "code": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": false
            },
            "sessionUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "Session",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "count": {
                "type": Sequelize.INTEGER,
                "allowNull": true
            },
            "information": {
                "type": Sequelize.JSONB,
                "allowNull": true
            },
            "acceptStatus": {
                "type": Sequelize.BOOLEAN,
                "allowNull": true
            },
            "reserveUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "Reserve",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "WorkPlan",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "startDay": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "endDay": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "day": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "startTime": {
                "type": Sequelize.TIME,
                "allowNull": false
            },
            "endTime": {
                "type": Sequelize.TIME,
                "allowNull": false
            },
            "genderType": {
                "type": Sequelize.ENUM( "مرد", "زن" ),
                "allowNull": true
            },
            "sportSiteUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "SportSite",
                    "key": "uuid"
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Notification",
        {
            "uuid": {
                "type": Sequelize.UUID,
                "defaultValue": Sequelize.UUIDV4,
                "primaryKey": true
            },
            "title": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "content": {
                "type": Sequelize.TEXT,
                "allowNull": false
            },
            "userUUID": {
                "type": Sequelize.UUID,
                "onUpdate": "CASCADE",
                "onDelete": "NO ACTION",
                "references": {
                    "model": "User",
                    "key": "uuid"
                },
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "createTable",
    "params": [
        "Log",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "primaryKey": true,
                "autoIncrement": true
            },
            "data": {
                "type": Sequelize.JSONB,
                "allowNull": false
            },
            "ownerResourceUUID": {
                "type": Sequelize.UUID,
                "allowNull": true
            },
            "ownerResourceType": {
                "type": Sequelize.STRING,
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
},
{
    "fn": "addIndex",
    "params": [
        "Hdate",
        [ "sportSiteUUID", "date" ],
        {
            "name": "hdate_sport_site_u_u_i_d_date",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "Like",
        [ "ownerResourceUUID", "userUUID" ],
        {
            "name": "like_owner_resource_u_u_i_d_user_u_u_i_d",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "Rate",
        [ "ownerResourceUUID", "userUUID" ],
        {
            "name": "rate_owner_resource_u_u_i_d_user_u_u_i_d",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "RateItem",
        [ "rateUUID", "itemName" ],
        {
            "name": "rate_item_rate_u_u_i_d_item_name",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "Session",
        [ "sessionTimeUUID", "date", "sportType", "adultType", "qualityType" ],
        {
            "name": "session_session_time_u_u_i_d_date_sport_type_adult_type_quality_type",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "SessionTime",
        [ "sportSiteUUID", "startTime", "endTime" ],
        {
            "name": "session_time_sport_site_u_u_i_d_start_time_end_time",
            "type": "UNIQUE"
        }
    ]
},
{
    "fn": "addIndex",
    "params": [
        "WorkPlan",
        [ "day", "startDay", "endDay", "startTime", "endTime", "genderType", "sportSiteUUID" ],
        {
            "name": "work_plan_day_start_day_end_day_start_time_end_time_gender_type_sport_site_u_u_i_d",
            "type": "UNIQUE"
        }
    ]
}
];

let rollbackCommands = [ {
    "fn": "dropTable",
    "params": [ "Address" ]
},
{
    "fn": "dropTable",
    "params": [ "Baner" ]
},
{
    "fn": "dropTable",
    "params": [ "Comment" ]
},
{
    "fn": "dropTable",
    "params": [ "Customer" ]
},
{
    "fn": "dropTable",
    "params": [ "DiscountPrivate" ]
},
{
    "fn": "dropTable",
    "params": [ "DiscountPublic" ]
},
{
    "fn": "dropTable",
    "params": [ "Hdate" ]
},
{
    "fn": "dropTable",
    "params": [ "Like" ]
},
{
    "fn": "dropTable",
    "params": [ "Media" ]
},
{
    "fn": "dropTable",
    "params": [ "Payment" ]
},
{
    "fn": "dropTable",
    "params": [ "Provider" ]
},
{
    "fn": "dropTable",
    "params": [ "ProviderAssistant" ]
},
{
    "fn": "dropTable",
    "params": [ "ProviderAssistantResourcePermission" ]
},
{
    "fn": "dropTable",
    "params": [ "Rate" ]
},
{
    "fn": "dropTable",
    "params": [ "RateItem" ]
},
{
    "fn": "dropTable",
    "params": [ "Reserve" ]
},
{
    "fn": "dropTable",
    "params": [ "ReserveItem" ]
},
{
    "fn": "dropTable",
    "params": [ "Session" ]
},
{
    "fn": "dropTable",
    "params": [ "SessionTime" ]
},
{
    "fn": "dropTable",
    "params": [ "SportSite" ]
},
{
    "fn": "dropTable",
    "params": [ "SportSiteComplex" ]
},
{
    "fn": "dropTable",
    "params": [ "SportSiteType" ]
},
{
    "fn": "dropTable",
    "params": [ "SportType" ]
},
{
    "fn": "dropTable",
    "params": [ "SupportTicket" ]
},
{
    "fn": "dropTable",
    "params": [ "User" ]
},
{
    "fn": "dropTable",
    "params": [ "CustomerCredit" ]
},
{
    "fn": "dropTable",
    "params": [ "UserDevice" ]
},
{
    "fn": "dropTable",
    "params": [ "UserShare" ]
},
{
    "fn": "dropTable",
    "params": [ "Wallet" ]
},
{
    "fn": "dropTable",
    "params": [ "WalletTransaction" ]
},
{
    "fn": "dropTable",
    "params": [ "WorkPlan" ]
},
{
    "fn": "dropTable",
    "params": [ "Notification" ]
},
{
    "fn": "dropTable",
    "params": [ "Log" ]
}
];

module.exports = {
    "pos": 0,
    "up": function( queryInterface, Sequelize ) {
        let index = this.pos;
        return new Promise( ( ( resolve, reject ) => {
            function next() {
                if ( index < migrationCommands.length ) {
                    let command = migrationCommands[ index ];
                    console.log( `[#${index}] execute: ${ command.fn}` );
                    index++;
                    queryInterface[ command.fn ].apply( queryInterface, command.params ).then( next, reject );
                } else {
                    resolve();
                }
            }
            next();
        } ) );
    },
    "down": function( queryInterface, Sequelize ) {
        let index = this.pos;
        return new Promise( ( ( resolve, reject ) => {
            function next() {
                if ( index < rollbackCommands.length ) {
                    let command = rollbackCommands[ index ];
                    console.log( `[#${index}] execute: ${ command.fn}` );
                    index++;
                    queryInterface[ command.fn ].apply( queryInterface, command.params ).then( next, reject );
                } else {
                    resolve();
                }
            }
            next();
        } ) );
    },
    "info": info
};
