module.exports = ( sequelize, DataTypes ) => {
    const UserShare = sequelize.define( "UserShare", {
        "shareCode": {
            "type": DataTypes.STRING,
            "primarykey": true,
            "allowNull": false
        },
        "destUserUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "status": {
            "type": DataTypes.BOOLEAN,
            "defaultValue": false
        },
        "originUserDeviceRegisterToken": {
            "type": DataTypes.STRING,
            "primaryKey": true
        },
        "originUserUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    return UserShare;
};
