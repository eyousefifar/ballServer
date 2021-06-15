module.exports = ( sequelize, DataTypes ) => {
    const Rate = sequelize.define( "Rate", {
        "uuid": {
            "type": DataTypes.UUID,
            "primaryKey": true,
            "defaultValue": DataTypes.UUIDV4
        },
        "rateAmount": {
            "type": DataTypes.DOUBLE,
            "allowNull": false
        },
        "userUUID": {
            "type": DataTypes.UUID,
            "allowNull": false
        },
        "commentUUID": {
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
    }, {
        "freezeTableName": true,
        "indexes": [
            {
                "unique": true,
                "fields": [ "ownerResourceUUID", "userUUID" ]

            }
        ]
    } );
    Rate.associate = function( models ) {
        Rate.hasMany( models.RateItem, { "as": "rateItems", "foreignKey": "rateUUID" } );
        Rate.belongsTo( models.Comment, {
            "as": "comment",
            "foreignKey": 'commentUUID'
        } );
        Rate.belongsTo( models.SportSite, {
            "as": 'sportSite',
            "foreignKey": 'ownerResourceUUID',
            "constraints": false
        } );
        Rate.belongsTo( models.User, {
            "as": 'user',
            "foreignKey": 'userUUID'
        } );
    };
    return Rate;
};
