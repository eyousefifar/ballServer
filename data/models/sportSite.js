const { sportTypes, sportSiteTypes, genderTypes } = require( "../../services/sportSite/configs" ).constants;

module.exports = ( sequelize, DataTypes ) => {
    const SportSite = sequelize.define( "SportSite", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "name": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "tel": {
            "type": DataTypes.ARRAY( {
                "type": DataTypes.STRING
            } ),
            "allowNull": false,
            "unique": {
                "args": true,
                "msg": "چنین شماره تلفنی از قبل ثبت شده است"
            }
        },
        "description": {
            "type": DataTypes.TEXT,
            "allowNull": true
        },
        "playgroundInformation": {
            "type": DataTypes.JSONB,
            "allowNull": false
        },
        "type": {
            "type": DataTypes.ENUM( sportSiteTypes ),
            "allowNull": false
        },
        "sportTypes": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( sportTypes ) ),
            "allowNull": true
        },
        "genderTypes": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( genderTypes ) ),
            "allowNull": false
        },
        "rateCount": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
        },
        "rateAvg": {
            "type": DataTypes.DOUBLE,
            "allowNull": false,
            "defaultValue": 0
        },
        "maxDiscountPrecent": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "maxDiscountExpireDate": {
            "type": DataTypes.DATE,
            "allowNull": true
        },
        "minPrice": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
        },
        "mainPicUrl": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "sessionTimeInHour": {
            "type": DataTypes.DOUBLE,
            "allowNull": true
        },
        "enableStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": true
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "addressUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "sportSiteComplexUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    SportSite.associate = function( models ) {
        SportSite.hasMany( models.WorkPlan, { "as": "workPlans", "foreignKey": "sportSiteUUID" } );
        SportSite.hasMany( models.Hdate, { "as": "hdates", "foreignKey": "sportSiteUUID" } );
        SportSite.hasMany( models.SessionTime, { "as": "sessionTimes", "foreignKey": "sportSiteUUID" } );
        SportSite.hasMany( models.Reserve, { "as": "reserves", "foreignKey": "sportSiteUUID" } );
        SportSite.hasMany( models.Media, {
            "as": "medias",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false,
            "scope": {
                "ownerResourceType": "SportSite"
            }
        } );
        SportSite.hasMany( models.Rate, {
            "as": "rates",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false,
            "scope": {
                "ownerResourceType": "SportSite"
            }
        } );
        SportSite.hasMany( models.SupportTicket, {
            "as": "supportTickets",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false,
            "scope": {
                "ownerResourceType": "SportSite"
            }
        } );
        SportSite.hasOne( models.Wallet, {
            "as": "wallet",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false,
            "scope": {
                "ownerResourceType": "SportSite"
            }
        } );
        SportSite.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
        SportSite.belongsTo( models.Address, { "as": "address", "foreignKey": "addressUUID" } );
    };
    return SportSite;
};
