module.exports = ( sequelize, DataTypes ) => {
    const DiscountPrivate = sequelize.define( "DiscountPrivate", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "capacity": {
            "type": DataTypes.INTEGER,
            "allowNull": false
        },
        "code": {
            "type": DataTypes.STRING,
            "unique": {
                "args": true,
                "msg": "چنین کد تخفیفی از قبل ثبت شده است"
            },
            "allowNull": false
        },
        "precent": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "expireDate": {
            "type": DataTypes.DATE,
            "allowNull": false
        },
        "enableStatus": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": false,
            "allowNull": false
        },
        "ownerResourceUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "ownerResourceType": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, { "freezeTableName": true } );

    return DiscountPrivate;
};
