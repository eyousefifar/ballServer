class TokenUtil {
    constructor( jwt, redisDbClient, jwtSecretKey ) {
        this.jwt = jwt;
        this.redisDbClient = redisDbClient;
        this.jwtSecretKey = jwtSecretKey;
    }
    async isRevoked( token ) {
        try {
            return await this.redisDbClient.sismember( "revoked:tokens", token );
        } catch ( err ) {
            throw err;
        }
    }
    async generateToken( { payload = {}, expInHours = 3000 } ) {
        let token;
        let options = {
            "expiresIn": `${expInHours}h`
        };

        try {
            token = this.jwt.sign( payload, options );
            return token;
        } catch ( err ) {
            throw err;
        }
    }
    async revokeToken( token ) {
        try {
            return await this.redisDbClient.sadd( "revoked:tokens", token );
        } catch ( err ) {
            throw err;
        }
    }
    async verifyToken( token ) {
        try {
            return await this.jwt.verify( token, this.jwtSecretKey );
        } catch ( err ) {
            throw err;
        }
    }
}
    

module.exports = TokenUtil;
