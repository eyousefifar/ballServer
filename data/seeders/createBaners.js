const faker = require( "faker" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        for ( let i = 0;i < 5;i++ ) {
            try {
                const baner = await models.Baner.build( {
                    "description": "بنر تست",
                    "mainPicUrl": "http://localhost/media-storage/sport-sites/the-langham-london-hotel-pool.jpg"
                } ).save();
                await models.Media.build( {
                    "destFileName": `baner_image`,
                    "destFileLocation": "baners",
                    "destFileMimeType": "image/jpeg",
                    "destFileUrl": "http://localhost/media-storage/sport-sites/the-langham-london-hotel-pool.jpg",
                    "isMain": true,
                    "description": "تصویر اصلی",
                    "ownerResourceUUID": baner.uuid,
                    "ownerResourceType": "Baner"
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

