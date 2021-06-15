const faker = require( "faker" );
const argon = require( "argon2" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        try {
            await models.User.build( {
                "name": faker.name.findName(),
                "types": [ "admin" ],
                "phone": faker.phone.phoneNumber(),
                "email": `admin@ballinc.com`,
                "emailConfirm": true,
                "password": await argon.hash( "admin123" ),
                "createdAt": new Date(),
                "updatedAt": new Date()
            } ).save();
        } catch ( err ) {
            console.log( err );
            console.log( "re run" );
            this.up( models );
        }
    },
    "down": ( models ) => {
    }
};
