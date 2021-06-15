module.exports = ( sequelize, DataTypes ) => {
    const Notification = sequelize.define( "Notification", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "title": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "content": {
            "type": DataTypes.TEXT,
            "allowNull": false
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        }
    }, {
        "freezeTableName": true
    } );
    Notification.associate = function( models ) {
        Notification.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
    };
    return Notification;
};
