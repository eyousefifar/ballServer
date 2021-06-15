const faker = require( "faker" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        const sportSiteUUIDObjs = await models.SportSite.findAll( {
            "attributes": [ "uuid" ]
        } );

        for ( const sportSiteUUIDObj of sportSiteUUIDObjs ) {
            try {
                await models.WorkPlan.build( {
                    "startDay": "شنبه",
                    "endDay": "پنج شنبه",
                    "startTime": "10:30",
                    "endTime": "12:30",
                    "genderType": "مردها",
                    "sportSiteUUID": sportSiteUUIDObj.uuid
                } ).save();
                await models.WorkPlan.build( {
                    "day": "شنبه",
                    "startTime": "12:30",
                    "endTime": "14:30",
                    "genderType": "زنها",
                    "sportSiteUUID": sportSiteUUIDObj.uuid
                } ).save();
            } catch ( err ) {
                console.log( err );
                console.log( "re try" );
                continue;
            }
        }
    },
    "down": ( models ) => {
    }
};

