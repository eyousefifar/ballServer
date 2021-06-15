const path = require( "path" );

require( "dotenv" ).config( { "path": path.resolve( process.cwd(), "./.env" ) } );
if ( !process.env.ENV ) {
    process.env.ENV = "development";
}

const
    dbConfig = require( "./configs.global" )( process.env ).db[ process.env.ENV ],
    Sequelize = require( "sequelize" ),
    pump = require( 'pump' ),
    through = require( 'through2' );
const sequelize = new Sequelize( dbConfig.dbName, dbConfig.userName, dbConfig.password, dbConfig );

sequelize.import( "./data/models/log" );
const collectLogs = () => {
    const logTransporter = through.obj( ( chunk, enc, cb ) => {
        const chunkStr = chunk.toString( enc );

        try {
            const log = JSON.parse( chunkStr );
            
            sequelize.models.Log.create( { "data": log } );
        } catch ( err ) { }
        cb();
    } );
    
    pump( process.stdin, logTransporter );
};

collectLogs();

