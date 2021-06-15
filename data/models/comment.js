module.exports = ( sequelize, DataTypes ) => {
    const Comment = sequelize.define( "Comment", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "text": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "confirmStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "hasRepliedComments": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "userType": {
            "type": DataTypes.ENUM( "admin", "provider", "customer", "providerAssistant" ),
            "allowNull": false
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "replyCommentUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "ownerResourceUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "ownerResourceType": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    Comment.associate = function( models ) {
        Comment.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
        Comment.hasMany( models.Comment, { "as": "replyComments", "foreignKey": "replyCommentUUID" } );
    };
    return Comment;
};
