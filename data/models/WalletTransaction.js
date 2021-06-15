module.exports = ( sequelize, DataTypes ) => {
    const WalletTransaction = sequelize.define( "WalletTransaction", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "amount": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "transactionType": {
            "type": DataTypes.ENUM( "inc", "dec" ),
            "allowNull": false
        },
        "description": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "paymentUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "walletUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    WalletTransaction.associate = function( models ) {
        WalletTransaction.belongsTo( models.Wallet, { "as": "wallet", "foreignKey": "walletUUID" } );
        WalletTransaction.belongsTo( models.Payment, { "as": "payment", "foreignKey": "paymentUUID" } );
    };
    return WalletTransaction;
};
