const axios = require( "axios" );

class PoosheStrategy {
    constructor( apiKey, sendEndpoint, appIds ) {
        this.apiKey = apiKey;
        this.sendEndpoint = sendEndpoint;
        this.appIds = appIds;
    }
    async sendToAll( title, content ) {
        await axios( {
            "method": "POST",
            "url": this.sendEndpoint,
            "headers": { 'Authorization': `Token ${this.apiKey}` },
            "data": {
                "app_ids": this.appIds,
                "data": {
                    "title": title,
                    "content": content
                }
            }
        } );
    }
    async send( reciverIds, title, content ) {
        await axios( {
            "method": "POST",
            "url": this.sendEndpoint,
            "headers": { 'Authorization': `Token ${this.apiKey}` },
            "data": {
                "app_ids": this.appIds,
                "filters": {
                    "pushe_id": reciverIds
                },
                "data": {
                    "title": title,
                    "content": content
                }
            }
        } );
    }
}

module.exports = { PoosheStrategy };
