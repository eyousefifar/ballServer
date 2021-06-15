const faker = require( "faker" );
const { sportSiteTypes } = require( "../../services/sportSite/configs" ).constants;

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        const providerUserUUIDObjs = await models.Provider.findAll( {
            "attributes": [ "userUUID" ]
        } );

        for ( let i = 0;i < 100;i++ ) {
            const sportSiteType = sportSiteTypes[ Math.floor( Math.random() * sportSiteTypes.length ) ];
            const sportTypes = () => sportSiteType === "استخر" ? [ "شنا" ] : sportSiteType === "سالن سرپوشیده" ? [ "فوتسال", "والیبال", "بسکتبال" ] : sportSiteType === "چمن مصنوعی" ? [ "فوتبال" ] : sportSiteType === "اتاق فرار" ? [ "اتاق فرار" ] : [];

            try {
                const address = await models.Address.build( {
                    "city": "قم",
                    "area": "باجک",
                    "descriptiveAddress": "قم باجک",
                    "postalCode": faker.address.zipCode(),
                    "coordinateAddress": [ faker.address.latitude(), faker.address.longitude() ],
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                } ).save();
                
                await models.SportSite.build( {
                    "name": `${sportSiteType}_${faker.name.findName()}`,
                    "complexStatus": faker.random.boolean(),
                    "tel": [ faker.phone.phoneNumber() ],
                    "description": faker.lorem.text(),
                    "type": sportSiteType,
                    "sportTypes": sportTypes(),
                    "genderTypes": [ "زن", "مرد" ],
                    "playgroundInformation": {},
                    "enableStatus": faker.random.boolean(),
                    "addressUUID": address.uuid,
                    "userUUID": providerUserUUIDObjs[ Math.floor( Math.random() * providerUserUUIDObjs.length ) ].userUUID,
                    "mainPicUrl": "http://localhost/media-storage/sport-sites/the-langham-london-hotel-pool.jpg"
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

