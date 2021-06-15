module.exports = ( sequelize, DataTypes ) => {
    const Baner = sequelize.define( "Baner", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "description": {
            "type": DataTypes.STRING,
            "allowNull": false
        },
        "accessLink": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "mainPicUrl": {
            "type": DataTypes.STRING,
            "allowNull": true
        }
    }, { "freezeTableName": true } );
    Baner.associate = function( models ) {
        Baner.hasOne( models.Media, {
            "as": "media",
            "foreignKey": 'ownerResourceUUID',
            "constraints": false,
            "scope": {
                "ownerResourceType": "Baner"
            }
        } );
    };
    return Baner;
};
