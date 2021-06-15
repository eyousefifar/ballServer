const crypto = require( "crypto" ),
    { sprintf } = require( "sprintf-js" ),
    { shareLink, shareLinkValidTime } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj }, redisDbClient, errorUtil, sequelizeCachingUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.redisDbClient = redisDbClient;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.tokenUtil = tokenUtil;
        this.errorUtil = errorUtil;
    }

    async createLink( userUUID ) {
        const randomString = crypto.randomBytes( 16 ).toString( "hex" );
        
        await this.redisDbClient.setex( randomString, shareLinkValidTime * 60, userUUID );
        sprintf( shareLink, randomString );
        return shareLink;
    }
}

module.exports = Logics;
