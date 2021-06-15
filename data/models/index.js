const path = require( "path" );

require( "dotenv" ).config( { "path": path.resolve( process.cwd(), "../.env" ) } );
if ( !process.env.ENV ) {
    process.env.ENV = "development";
}
console.log( `app run in ${process.env.ENV} mode` );

const
    fs = require( "fs" ),
    basename = path.basename( __filename ),
    dbConfig = require( "../../configs.global" )( process.env ).db[ process.env.ENV ],
    Sequelize = require( "sequelize" ),
    sequelize = new Sequelize( dbConfig.dbName, dbConfig.userName, dbConfig.password, dbConfig ),
    db = {};

fs
    .readdirSync( __dirname )
    .filter( file => {
        return ( file.indexOf( "." ) !== 0 ) && ( file !== basename ) && ( file.slice( -3 ) === ".js" );
    } )
    .forEach( file => {
        const model = sequelize.import( path.join( __dirname, file ) );

        db[ model.name ] = model;
    } );
Object.keys( db ).forEach( modelName => {
    if ( db[ modelName ].associate ) {
        db[ modelName ].associate( db );
    }
} );

db.sequelize = sequelize;
module.exports = db;
