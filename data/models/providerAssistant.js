module.exports = ( sequelize, DataTypes ) => {
    const ProviderAssistant = sequelize.define( "ProviderAssistant", {
        "userUUID": {
            "type": DataTypes.UUID,
            "primaryKey": true
        },
        "acceptStatus": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": false,
            "allowNull": false
        },
        "sportSiteUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    ProviderAssistant.associate = function( models ) {
        ProviderAssistant.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
    };
    return ProviderAssistant;
};
