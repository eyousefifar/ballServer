module.exports = ( sequelize, DataTypes ) => {
    const Wallet = sequelize.define( "Wallet", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "amount": {
            "type": DataTypes.DOUBLE,
            "allowNull": false,
            "defaultValue": 0
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
    Wallet.associate = function( models ) {
        Wallet.hasMany( models.WalletTransaction, { "as": "walletTransactions", "foreignKey": "walletUUID" } );
    };
    return Wallet;
};
