const axios = require( "axios" ),
    ClientError = require( "../types/ClientError" );

class PayIrStrategy {
    constructor( apiKey, sendEndPoint, verifyEndPoint, gateway ) {
        this.apiKey = apiKey;
        this.sendEndPoint = sendEndPoint;
        this.verifyEndPoint = verifyEndPoint;
        this.gateway = gateway;
    }
    async send( amount, callbackUrl, clientRefId ) {
        try {
            const { data } = await axios( {
                "method": "POST",
                "url": this.sendEndPoint,
                "data": {
                    "api": this.apiKey,
                    "amount": amount,
                    "redirect": callbackUrl,
                    "factorNumber": clientRefId
                }
            } );

            return { "paymentToken": data.token, "paymentLink": `${this.gateway}${data.token}` };
        } catch ( error ) {
            throw new ClientError( "مشکلی در پرداخت وجود دارد", 400 );
        }
    }
    async verify( token ) {
        try {
            const { data } = await axios( {
                "method": "POST",
                "url": this.verifyEndPoint,
                "data": {
                    "api": this.apiKey,
                    "token": token
                }
            } );
    
            return data;
        } catch ( error ) {
            throw new ClientError( "مشکلی در پرداخت وجود دارد", 400 );
        }
    }
}
class PayPingStrategy {
    constructor( apiKey, sendEndPoint, verifyEndPoint, gateway ) {
        this.apiKey = apiKey;
        this.sendEndPoint = sendEndPoint;
        this.verifyEndPoint = verifyEndPoint;
        this.gateway = gateway;
    }
    async send( amount, callbackUrl, clientRefId, { payerIdentity = null, payerName = null, description = null } ) {
        try {
            const { data } = await axios( {
                "method": "POST",
                "url": this.sendEndPoint,
                "headers": { 'Authorization': `Bearer ${this.apiKey}` },
                "data": {
                    "amount": amount,
                    "payerIdentity": payerIdentity,
                    "payerName": payerName,
                    "description": description,
                    "returnUrl": callbackUrl,
                    "clientRefId": clientRefId
                }
            } );

            return { "paymentToken": data.code, "paymentLink": `${this.gateway}${data.code}` };
        } catch ( error ) {
            throw new ClientError( "مشکلی در پرداخت وجود دارد", 400 );
        }
    }
    async verify( amount, refId ) {
        try {
            await axios( {
                "method": "POST",
                "url": this.verifyEndPoint,
                "data": {
                    "amount": amount,
                    "refId": refId
                }
            } );
        } catch ( error ) {
            throw new ClientError( "مشکلی در پرداخت وجود دارد", 400 );
        }
    }
}
module.exports = { PayIrStrategy, PayPingStrategy };
