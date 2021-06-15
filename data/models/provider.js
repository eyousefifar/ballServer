module.exports = ( sequelize, DataTypes ) => {
    const Provider = sequelize.define( "Provider", {
        "userUUID": {
            "type": DataTypes.UUID,
            "primaryKey": true
        },
        "isin": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "fatherName": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "homeTelphone": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    Provider.associate = function( models ) {
        Provider.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
    };
    return Provider;
};
