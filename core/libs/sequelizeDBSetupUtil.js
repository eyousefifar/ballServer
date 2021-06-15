const fs = require( "fs" ),
    path = require( "path" );

class SequelizeDBSetupUtil {
    constructor( sequelizeDbObj, sequelizeObj, sequelizeCachingUtil, modelsPath, viewsPath, viewModelsPath ) {
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.modelsPath = modelsPath;
        this.viewsPath = viewsPath;
        this.viewModelsPath = viewModelsPath;
    }

    async setup() {
        await this.addModels();
        await this.associateModels();
    }

    async addModels() {
        fs
            .readdirSync( this.modelsPath )
            .filter( file => {
                return ( file.indexOf( "." ) !== 0 ) && ( file.slice( -3 ) === ".js" ) && ( file !== "index.js" );
            } )
            .forEach( file => {
                this.sequelizeDbObj.import( path.join( this.modelsPath, file ) );
            } );
    }

    async associateModels() {
        const { models } = this.sequelizeDbObj;

        for ( let modelName in models ) {
            if ( models[ modelName ].associate ) {
                models[ modelName ].associate( models );
            }
        }
    }

    async addViews() {
        fs
            .readdirSync( this.viewsPath )
            .filter( file => {
                return ( file.indexOf( "." ) !== 0 ) && ( file.slice( -4 ) === ".sql" );
            } )
            .forEach( file => {
                const viewFilePath = `${this.viewsPath}/${file}`;
                const viewFile = fs.readFileSync( viewFilePath ).toString();
                    
                this.sequelizeDbObj.query( viewFile );
            } );
    }

    async addViewModels() {
        fs
            .readdirSync( this.viewModelsPath )
            .filter( file => {
                return ( file.indexOf( "." ) !== 0 ) && ( file.slice( -3 ) === ".js" );
            } )
            .forEach( file => {
                this.sequelizeDbObj.import( path.join( this.viewModelsPath, file ) );
            } );
    }

    async addExtendedCommands() {
        this.sequelizeDbObj.extendedCommands = {
            "refreshMaterializedView": ( viewName, t = null ) => {
                return this.sequelizeDbObj.query( `REFRESH MATERIALIZED VIEW ${viewName};`, {
                    "transaction": t
                } );
            }
        };
    }
    
    async addHoooks() {
    }
}
module.exports = SequelizeDBSetupUtil;
