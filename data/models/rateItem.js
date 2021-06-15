module.exports = ( sequelize, DataTypes ) => {
    const RateItem = sequelize.define( "RateItem", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "itemName": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "rateAmount": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "rateUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, {
        "freezeTableName": true,
        "indexes": [
            {
                "unique": true,
                "fields": [ "rateUUID", "itemName" ]

            }
        ]
    } );
    RateItem.associate = function( models ) {
        RateItem.belongsTo( models.Rate, { "as": "rate", "foreignKey": "rateUUID" } );
    };
    return RateItem;
};
