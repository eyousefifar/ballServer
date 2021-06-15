module.exports = ( sequelize, DataTypes ) => {
    const SportSiteType = sequelize.define( "SportSiteType", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "name": {
            "type": DataTypes.STRING,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    SportSiteType.associate = function( models ) {
        SportSiteType.hasMany( models.SportType, { "as": "sportTypes", "foreignKey": "sportSiteTypeUUID" } );
    };
    return SportSiteType;
};
