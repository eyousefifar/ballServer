module.exports = ( sequelize, DataTypes ) => {
    const ReserveItem = sequelize.define( "ReserveItem", {
        "uuid": {
            "type": DataTypes.UUID,
            "defaultValue": DataTypes.UUIDV4,
            "primaryKey": true
        },
        "code": {
            "type": DataTypes.STRING,
            "allowNull": false,
            "unique": true
        },
        "sessionUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "count": {
            "type": DataTypes.INTEGER,
            "allowNull": true
        },
        "information": {
            "type": DataTypes.JSONB,
            "allowNull": true
        },
        "acceptStatus": {
            "type": DataTypes.BOOLEAN,
            "allowNull": true
        },
        "reserveUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        }
    }, { "freezeTableName": true } );
    ReserveItem.associate = function( models ) {
        ReserveItem.belongsTo( models.Reserve, { "as": "reserve", "foreignKey": "reserveUUID" } );
        ReserveItem.belongsTo( models.Session, { "as": "session", "foreignKey": "sessionUUID" } );
    };
    return ReserveItem;
};
