module.exports = ( sequelize, DataTypes ) => {
    const DiscountPublic = sequelize.define( "DiscountPublic", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "precent": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "expireDate": {
            "type": DataTypes.DATE,
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
    return DiscountPublic;
};
