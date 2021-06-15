module.exports = ( sequelize, DataTypes ) => {
    const WorkPlan = sequelize.define( "WorkPlan", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "startDay": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "endDay": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "day": {
            "type": DataTypes.STRING,
            "allowNull": true
        },
        "startTime": {
            "type": DataTypes.TIME,
            "allowNull": false
        },
        "endTime": {
            "type": DataTypes.TIME,
            "allowNull": false
        },
        "genderType": {
            "type": DataTypes.ENUM( "مرد", "زن" ),
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
                "fields": [ "day", "startDay", "endDay", "startTime", "endTime", "genderType", "sportSiteUUID" ]

            }
        ]
    } );
    WorkPlan.associate = function( models ) {
        WorkPlan.belongsTo( models.SportSite, { "as": "sportSite", "foreignKey": "sportSiteUUID" } );
    };
    return WorkPlan;
};
