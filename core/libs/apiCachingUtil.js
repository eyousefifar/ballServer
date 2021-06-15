class ApiCachingUtil {
    constructor( redisDbClient, ttl ) {
        this.redisDbClient = redisDbClient;
        this.ttl = ttl;
    }
    async setCache( key, value ) {
        const valueStr = JSON.stringify( value );

        await this.redisDbClient.set( key, valueStr, "EX", this.ttl );
    }

    async getCache( key ) {
        const result = await this.redisDbClient.get( key );

        return JSON.parse( result );
    }

    async delCache( key ) {
        return await this.redisDbClient.del( key );
    }

    async generateKeyFromReq( req ) {
        const key = req.raw.url;

        return key;
    }

    async setResponseToCacheByReq( req, value ) {
        const key = await this.generateKeyFromReq( req );

        if ( value ) {
            await this.setCache( key, value );
        }
    }

    async getResponseFromCacheByReq( req ) {
        const key = await this.generateKeyFromReq( req );

        return await this.getCache( key );
    }
}

module.exports = ApiCachingUtil;
