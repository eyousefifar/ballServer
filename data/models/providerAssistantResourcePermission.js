// this is not complete yet
module.exports = ( sequelize, DataTypes ) => {
    const ProviderAssistantResourcePermission = sequelize.define( "ProviderAssistantResourcePermission", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "resourceName": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "action": {
            "type": DataTypes.ENUM( "add", "read", "edit", "remove", "all" ),
            "allowNull": false
        },
        "sportSiteUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    return ProviderAssistantResourcePermission;
};
