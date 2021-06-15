const axios = require( "axios" ),
    qs = require( "querystring" );

class KavehnegarStrategy {
    constructor( apiKey, verifyEndPoint ) {
        this.apiKey = apiKey;
        this.verifyEndPoint = verifyEndPoint;
    }
    async verifyPhone( phone, tokenKey ) {
        const data = qs.stringify( {
            "receptor": phone,
            "token": tokenKey,
            "template": "verify-ball"
        } );
        return await axios( {
            "method": "POST",
            "url": this.verifyEndPoint,
            "data": data,
            "headers": {
                "Content-type": "application/x-www-form-urlencoded"
            }
        } );
    }
}
class GhasedakStrategy {
    constructor( apiKey, verifyEndPoint ) {
        this.apiKey = apiKey;
        this.verifyEndPoint = verifyEndPoint;
    }
    async verifyPhone( phone, tokenKey ) {
        const data = qs.stringify( {
            "receptor": phone,
            "param1": tokenKey,
            "type": 1,
            "template": "ballverify"
        } );
       
        return await axios( {
            "method": "POST",
            "url": this.verifyEndPoint,
            "data": data,
            "headers": {
                "Content-type": "application/x-www-form-urlencoded",
                "apikey": this.apiKey
            }
        } );
    }
}


module.exports = { KavehnegarStrategy, GhasedakStrategy };
