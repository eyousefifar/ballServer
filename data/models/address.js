const cityNames = [
    "قم"
];

module.exports = ( sequelize, DataTypes ) => {
    const Address = sequelize.define( "Address", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "city": {
            "type": DataTypes.ENUM( ...cityNames ),
            "allowNull": false
        },
        "area": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "descriptiveAddress": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "coordinateAddress": {
            "type": DataTypes.ARRAY( DataTypes.DOUBLE ),
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین مختصاتی از قبل ثبت شده است"
            }
        },
        "postalCode": {
            "type": DataTypes.STRING,
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین کد پستی ای از قبل ثبت شده است"
            }
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
    return Address;
};
