const nodemailer = require( "nodemailer" );

class EmailUtil {
    constructor( host, port, secureStatus, userName, password, from ) {
        this.from = from;
        this.smtpTransport = nodemailer.createTransport( {
            "host": host,
            "port": port,
            "secure": secureStatus,
            "auth": {
                "user": userName,
                "pass": password
            }
        } );
    }
    async sendEmail( to, subject, payload ) {
        const mailOptions = {
            "from": this.from,
            "to": to,
            "subject": subject,
            "html": payload.html
        };
        try {
            await this.smtpTransport.sendMail( mailOptions );
        } catch ( err ) {
            throw err;
        }
    }
}

module.exports = EmailUtil;
