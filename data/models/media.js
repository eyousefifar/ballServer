module.exports = ( sequelize, DataTypes ) => {
    const Media = sequelize.define( "Media", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "destFileName": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "destFileLocation": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "destFileMimeType": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "destFileUrl": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "size": {
            "type": DataTypes.JSONB,
            "allowNull": true
        },
        "isMain": {
            "type": DataTypes.BOOLEAN,
            "allowNull": false,
            "defaultValue": false
        },
        "description": {
            "type": DataTypes.STRING,
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
    
    Media.associate = function( models ) {
        Media.belongsTo( models.SportSite, {
            "as": 'sportSite',
            "foreignKey": 'ownerResourceUUID',
            "constraints": false
        } );
        Media.belongsTo( models.User, {
            "as": 'user',
            "foreignKey": 'ownerResourceUUID',
            "constraints": false
        } );
    };
    return Media;
};
