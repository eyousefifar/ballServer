module.exports = ( sequelize, DataTypes ) => {
    const SportType = sequelize.define( "SportType", {
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
    SportType.associate = function( models ) {
        SportType.belongsTo( models.SportSiteType, { "as": "sportSiteType", "foreignKey": "sportSiteTypeUUID" } );
    };
    return SportType;
};
