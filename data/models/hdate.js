module.exports = ( sequelize, DataTypes ) => {
    const Hdate = sequelize.define( "Hdate", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "date": {
            "type": DataTypes.DATEONLY,
            "allowNull": false
        },
        "description": {
            "type": DataTypes.STRING,
            "allowNull": true
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
                "fields": [ "sportSiteUUID", "date" ]

            }
        ]
    } );
    Hdate.associate = function( models ) {
        Hdate.belongsTo( models.SportSite, { "as": "sportSite", "foreignKey": "sportSiteUUID" } );
    };
    return Hdate;
};
