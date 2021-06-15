const fastifyPlugin = require( "fastify-plugin" ),
    SequelizeDBSetupUtil = require( "../libs/sequelizeDBSetupUtil" ),
    Sequelize = require( "sequelize" ),
    pg = require( "pg" );

delete pg.native;
class DbSequelizeActions {
    constructor( sequelizeDbObj ) {
        this.sequelizeObj = Sequelize;
        this.sequelizeDbObj = sequelizeDbObj;
        this.models = sequelizeDbObj.models;
    }

    async syncModel( model, syncMode = { "force": true } ) {
        try {
            model.sync( syncMode );
        } catch ( err ) {
            throw err;
        }
    }

    async defineModel( modelName, schema, opts ) {
        return this.sequelizeDbObj.define( modelName, schema, opts );
    }
}

const plugin = async( fastify, opts ) => {
    const options = {
        "dialectOptions": opts.dialectOptions,
        "dialectModule": pg,
        "timezone": opts.timezone,
        "pool": opts.pool,
        "logging": opts.logging
    };
    const { sequelizeCachingUtil } = fastify;
    const sequelizeDbObj = new Sequelize( `${opts.dialect}://${opts.userName}:${opts.password}@${opts.host}:${opts.port}/${opts.dbName}`, options );
    const sequelizeDBSetupUtil = new SequelizeDBSetupUtil( sequelizeDbObj, sequelizeCachingUtil, Sequelize, opts.modelsPath, opts.viewsPath, opts.viewModelsPath );

    await sequelizeDBSetupUtil.setup();
    
    try {
        await sequelizeDbObj.authenticate();
        fastify.decorate( "dbClient", new DbSequelizeActions( sequelizeDbObj ) );
    } catch ( err ) {
        throw err;
    }
};

module.exports = fastifyPlugin( plugin, { "name": "dbClient" } );
