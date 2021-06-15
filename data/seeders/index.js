const models = require( "../models" );
const createAdminUser = require( "./createAdminUser" ),
    createProviderUsers = require( "./createProviderUsers" ),
    createCustomerUsers = require( "./createCustomerUsers" ),
    createSportSites = require( "./createSportSites" ),
    createSportSiteWorkPlans = require( "./createSportSiteWorkPlans" ),
    createSportSiteWalletAndTransactions = require( "./createSportSiteWalletAndTransactions" ),
    createSportSiteMedia = require( "./createSportSiteMedia" ),
    createBaners = require( "./createBaners" );

const up = async() => {
    await createAdminUser.up( models );
    await createCustomerUsers.up( models );
    await createProviderUsers.up( models );
    await createSportSites.up( models );
    await createSportSiteMedia.up( models );
    await createSportSiteWorkPlans.up( models );
    await createSportSiteWalletAndTransactions.up( models );
    await createBaners.up( models );
};
const down = async() => {
    await createAdminUser.down( models );
    await createCustomerUsers.down( models );
    await createProviderUsers.down( models );
    await createSportSites.down( models );
    await createSportSiteWorkPlans.down( models );
    await createSportSiteWalletAndTransactions.down( models );
    await createSportSiteMedia.down( models );
    await createBaners.down( models );
};
const main = async() => {
    await up();
};

main()
    .then( () => console.log( "success" ) )
    .catch( err => console.log( err ) );
