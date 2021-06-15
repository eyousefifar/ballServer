module.exports = ( sequelize, DataTypes ) => {
    const Like = sequelize.define( "Like", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "ownerResourceUUID": {
            "type": DataTypes.UUID,
            "allowNull": true
        },
        "ownerResourceType": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, {
        "freezeTableName": true,
        "indexes": [
            {
                "unique": true,
                "fields": [ "ownerResourceUUID", "userUUID" ]

            }
        ]
    } );
    Like.associate = function( models ) {
        Like.belongsTo( models.SportSite, {
            "as": "sportSite",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false
        } );
        Like.belongsTo( models.User, { "as": "user", "foreignKey": "userUUID" } );
    };
    return Like;
};
