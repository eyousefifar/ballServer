module.exports = ( sequelize, DataTypes ) => {
    const Reserve = sequelize.define( "Reserve", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "totalItemsPrice": {
            "type": DataTypes.INTEGER,
            "allowNull": false
        },
        "finalPrice": {
            "type": DataTypes.INTEGER,
            "allowNull": false
        },
        "totalDiscountPrecent": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "submitStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "acceptStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "paymentUUID": {
            "type": DataTypes.UUID,
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین پرداخت مستقیمی از قبل برای رزروی  ثبت شده است"
            }
        },
        "walletTransactionUUID": {
            "type": DataTypes.UUID,
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین پرداخت با کیف پولی از قبل برای رزروی  ثبت شده است"
            }
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "sportSiteUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    Reserve.associate = function( models ) {
        Reserve.hasMany( models.ReserveItem, { "as": "reserveItems", "foreignKey": "reserveUUID" } );
        Reserve.belongsTo( models.SportSite, { "as": "sportSite", "foreignKey": "sportSiteUUID" } );
        Reserve.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
        Reserve.belongsTo( models.Payment, { "as": "payment", "foreignKey": "paymentUUID" } );
        Reserve.belongsTo( models.WalletTransaction, { "as": "walletTransaction", "foreignKey": "walletTransactionUUID" } );
    };
    return Reserve;
};
