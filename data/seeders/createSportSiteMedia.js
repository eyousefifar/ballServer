const faker = require( "faker" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        const sportSites = await models.SportSite.findAll();

        for ( const sportSite of sportSites ) {
            try {
                for ( let i = 0;i < 5;i++ ) {
                    await models.Media.build( {
                        "destFileName": `${sportSite.type}_${faker.name.findName()}_image_${i}`,
                        "destFileLocation": "sport-sites",
                        "destFileMimeType": "image/jpeg",
                        "destFileUrl": "https://itsball.com/ball/media-storage/sport-sites/sportSite_6080c2f1-e004-4742-affb-9962bc4e482b_1575704638823",
                        "isMain": false,
                        "description": "تصویر زمینه",
                        "ownerResourceUUID": sportSite.uuid,
                        "ownerResourceType": "SportSite"
                    } ).save();
                }
                const mainMedia = await models.Media.build( {
                    "destFileName": `${sportSite.type}_${faker.name.findName()}_image_${6}`,
                    "destFileLocation": "sport-sites",
                    "destFileMimeType": "image/jpeg",
                    "destFileUrl": "https://itsball.com/ball/media-storage/sport-sites/sportSite_6080c2f1-e004-4742-affb-9962bc4e482b_1575704638823",
                    "isMain": true,
                    "description": "تصویر اصلی",
                    "ownerResourceUUID": sportSite.uuid,
                    "ownerResourceType": "SportSite"
                } ).save();

                await sportSite.update( {
                    "mainPicUrl": mainMedia.destFileUrl
                } );
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

