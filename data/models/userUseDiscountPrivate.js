module.exports = ( sequelize, DataTypes ) => {
    const UserUseDiscountPrivate = sequelize.define( "UserUseDiscountPrivate", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "discountPrivateUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "useStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        }
    }, { "freezeTableName": true } );
    UserUseDiscountPrivate.associate = function( models ) {
        UserUseDiscountPrivate.belongsTo( models.Customer, {
            "as": 'customer',
            "foreignKey": 'userUUID'
        } );
        UserUseDiscountPrivate.belongsTo( models.DiscountPrivate, {
            "as": 'discountPrivate',
            "foreignKey": 'discountPrivateUUID'
        } );
    };
    return UserUseDiscountPrivate;
};
