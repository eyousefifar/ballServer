module.exports = ( sequelize, DataTypes ) => {
    const CustomerCredit = sequelize.define( "CustomerCredit", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "amount": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 0
        },
        "creditUsageLimit": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 1
        },
        "creditAmountPerUsage": {
            "type": DataTypes.INTEGER,
            "allowNull": false,
            "defaultValue": 1
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );

    CustomerCredit.associate = function( models ) {
        CustomerCredit.belongsTo( models.Customer, { "as": "customer", "foreignKey": 'userUUID' } );
    };
    return CustomerCredit;
};
