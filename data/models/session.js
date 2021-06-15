const { sportTypes } = require( "../../services/sportSite/configs" ).constants;

module.exports = ( sequelize, DataTypes ) => {
    const Session = sequelize.define( "Session", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "date": {
            "type": DataTypes.DATEONLY,
            "allowNull": true
        },
        "isDynamic": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": false
        },
        "isMultiUse": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": true
        },
        "validDateRangeInDay": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "capacity": {
            "type": DataTypes.INTEGER,
            "allowNull": false
        },
        "price": {
            "type": DataTypes.INTEGER,
            "allowNull": false
        },
        "discountPrecent": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "discountExpireDate": {
            "type": DataTypes.DATE,
            "allowNull": true
        },
        "reservesCount": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
        },
        "genderType": {
            "type": DataTypes.ENUM( "مرد", "زن" ),
            "allowNull": true
        },
        "sportType": {
            "type": DataTypes.ENUM( sportTypes ),
            "allowNull": true
        },
        "adultType": {
            "type": DataTypes.ENUM( "بزرگسال", "خردسال" ),
            "allowNull": true
        },
        "qualityType": {
            "type": DataTypes.ENUM( "ویژه", "معمولی" ),
            "allowNull": true
        },
        "information": {
            "type": DataTypes.TEXT,
            "allowNull": true
        },
        "enableStatus": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": false,
            "allowNull": false
        },
        "lockAt": {
            "type": DataTypes.DATE,
            "allowNull": true
        },
        "sessionTimeUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, {
        "freezeTableName": true,
        "indexes": [
            {
                "unique": true,
                "fields": [ "sessionTimeUUID", "date", "sportType", "adultType", "qualityType" ]
            }
        ]
    } );
    Session.associate = function( models ) {
        Session.belongsTo( models.SessionTime, { "as": "sessionTime", "foreignKey": "sessionTimeUUID" } );
    };
    return Session;
};
