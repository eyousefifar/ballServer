const faker = require( "faker" );
const argon = require( "argon2" );

faker.locale = "fa";
module.exports = {
    "up": async( models ) => {
        for ( let i = 0;i < 100;i++ ) {
            const name = faker.name.findName();
            const password = `${name}_pass`;
            try {
                const user = await models.User.build( {
                    "name": name,
                    "types": [ "customer" ],
                    "phone": faker.phone.phoneNumber(),
                    "email": `${faker.random.number() }@${ faker.random.number() }.com`,
                    "emailConfirm": true,
                    "password": await argon.hash( password ),
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                } ).save();
                await models.Customer.build( {
                    "userUUID": user.uuid
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
