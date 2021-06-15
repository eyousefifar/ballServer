const fastifyPlugin = require( "fastify-plugin" ),
    casbin = require( "casbin" ),
    { SequelizeAdapter } = require( "casbin-sequelize-adapter" ),
    { RedisWatcher } = require( "redis-watcher" );

const casbinAclModelPath = `${process.cwd()}/acl.conf`;
const plugin = async( fastify, opts ) => {
    const casbinAdaptor = await SequelizeAdapter.newAdapter( {
        "dialect": opts.db.dialect,
        "host": opts.db.host,
        "username": opts.db.userName,
        "password": opts.db.password,
        "port": opts.db.port,
        "database": opts.db.dbName,
        "dialectOptions": opts.db.dialectOptions,
        "logging": opts.logging
    } );
    const casbinWatcher = await RedisWatcher.newWatcher( `redis://${opts.redisDb.host}:${opts.redisDb.port}/${opts.channel}` );
    const casbinEnforcer = await casbin.newEnforcer( casbinAclModelPath, casbinAdaptor );

    casbinEnforcer.setWatcher( casbinWatcher );
    const resourceAuthorizeUtil = {
        "addResourcePolicy": async( userUUID, resourceUUID, action ) => {
            await casbinEnforcer.addPolicy( userUUID, resourceUUID, action );
        },
        "checkResourceAccess": async( userUUID, resourceUUID, action ) => {
            return await casbinEnforcer.enforce( userUUID, resourceUUID, action );
        }
    };
    fastify.decorate( "resourceAuthorizeUtil", resourceAuthorizeUtil );
};

module.exports = fastifyPlugin( plugin, { "name": "resourceAuthorizeUtil" } );
