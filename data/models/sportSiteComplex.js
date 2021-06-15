const { sportTypes, sportSiteTypes, genderTypes } = require( "../../services/sportSite/configs" ).constants;

module.exports = ( sequelize, DataTypes ) => {
    const SportSiteComplex = sequelize.define( "SportSiteComplex", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "name": {
            "type": DataTypes.STRING,
            "allowNull": false,
            "unique": {
                "args": true,
                "msg": "چنین نام کسب و کاری از قبل ثبت شده است"
            }
        },
        "sportSiteTypes": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( ...sportSiteTypes ) ),
            "allowNull": true
        },
        "sportTypes": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( ...sportTypes ) ),
            "allowNull": true
        },
        "genderTypes": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( ...genderTypes ) ),
            "allowNull": true
        },
        "description": {
            "type": DataTypes.TEXT,
            "allowNull": true
        },
        "rateAvg": {
            "type": DataTypes.DOUBLE,
            "allowNull": false,
            "defaultValue": 0
        },
        "likeCount": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
        },
        "maxDiscountPrecent": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
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
        "enableStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "confirmationStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    SportSiteComplex.associate = function( models ) {
        SportSiteComplex.hasMany( models.SportSite, { "as": "sportSites", "foreignKey": "sportSiteComplexUUID" } );
    };
    return SportSiteComplex;
};
