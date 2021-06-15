module.exports = ( sequelize, DataTypes ) => {
    const SessionTime = sequelize.define( "SessionTime", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "startTime": {
            "type": DataTypes.TIME,
            "allowNull": false
        },
        "endTime": {
            "type": DataTypes.TIME,
            "allowNull": false
        },
        "sportSiteUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, {
        "freezeTableName": true,
        "indexes": [
            {
                "unique": true,
                "fields": [ "sportSiteUUID", "startTime", "endTime" ]
            }
        ]
    } );
    SessionTime.associate = function( models ) {
        SessionTime.hasMany( models.Session, { "as": "sessions", "foreignKey": "sessionTimeUUID" } );
        SessionTime.belongsTo( models.SportSite, { "as": "sportSite", "foreignKey": "sportSiteUUID" } );
    };
    return SessionTime;
};
