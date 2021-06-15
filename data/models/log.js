module.exports = ( sequelize, DataTypes ) => {
    const Log = sequelize.define( "Log", {
        "id": {
            "type": DataTypes.INTEGER,
            "primaryKey": true,
            "autoIncrement": true
        },
        "data": {
            "type": DataTypes.JSONB,
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
    return Log;
};
