module.exports = ( sequelize, DataTypes ) => {
    const UserDevice = sequelize.define( "UserDevice", {
        "deviceToken": {
            "type": DataTypes.STRING,
            "primaryKey": true
        },
        "deviceInfo": {
            "type": DataTypes.JSONB,
            "allowNull": true
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    return UserDevice;
};
