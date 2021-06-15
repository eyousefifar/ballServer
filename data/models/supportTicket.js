module.exports = ( sequelize, DataTypes ) => {
    const SupportTicket = sequelize.define( "SupportTicket", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "status": {
            "type": DataTypes.ENUM( "در انتظار پاسخ", "پاسخ داده شده", "بسته شده" ),
            "defaultValue": "در انتظار پاسخ",
            "allowNull": false
        },
        "type": {
            "type": DataTypes.ENUM( "پیشنهاد", "مشکل" ),
            "allowNull": true
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
    }, { "freezeTableName": true } );

    SupportTicket.associate = function( models ) {
        SupportTicket.belongsTo( models.SportSite, { "as": "sportSite", "foreignKey": 'ownerResourceUUID' } );
    };
    return SupportTicket;
};
