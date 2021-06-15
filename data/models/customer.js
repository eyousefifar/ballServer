module.exports = ( sequelize, DataTypes ) => {
    const Customer = sequelize.define( "Customer", {
        "userUUID": {
            "type": DataTypes.UUID,
            "primaryKey": true
        },
        "bodyInfo": {
            "type": DataTypes.JSONB,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    Customer.associate = function( models ) {
        Customer.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
    };
    return Customer;
};
