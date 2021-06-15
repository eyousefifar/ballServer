module.exports = ( sequelize, DataTypes ) => {
    const User = sequelize.define( "User", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "types": {
            "type": DataTypes.ARRAY( DataTypes.ENUM( "customer", "provider", "providerAssistant", "admin" ) ),
            "allowNull": true
        },
        "name": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "email": {
            "type": DataTypes.STRING,
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین ایمیلی از قبل ثبت شده است"
            }
        },
        "emailConfirm": {
            "type": DataTypes.BOOLEAN,
            "allowNull": true
        },
        "password": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "phone": {
            "type": DataTypes.STRING,
            "allowNull": true,
            "unique": {
                "args": true,
                "msg": "چنین شماره تلفنی از قبل ثبت شده است"
            }
        },
        "profilePicUrl": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    User.associate = function( models ) {
        User.hasMany( models.Comment, { "as": "comments", "foreignKey": "userUUID" } );
        User.hasMany( models.Notification, { "as": "notifications", "foreignKey": "userUUID" } );
    };
    return User;
};
