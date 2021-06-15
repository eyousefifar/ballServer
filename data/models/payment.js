module.exports = ( sequelize, DataTypes ) => {
    const Payment = sequelize.define( "Payment", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "amount": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "cardNumber": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "factorNumber": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "transactionId": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "status": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "paymentType": {
            "type": DataTypes.ENUM( "شارژ کیف پول", "رزرو مستقیم" ),
            "allowNull": false
        },
        "description": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "userUUID": {
            "type": DataTypes.UUID,
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
    return Payment;
};
