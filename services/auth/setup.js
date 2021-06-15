module.exports = ( { jobManagerUtil }, smsUtil, emailUtil ) => {
    jobManagerUtil.defineJob( "ball_send_verify_sms", async( job ) => {
        const { phone, randomInteger } = job.data;

        await smsUtil.verifyPhone( phone, randomInteger );
    } );
    jobManagerUtil.defineJob( "ball_send_verify_email", async( job ) => {
        const { to, subject, payload } = job.data;

        await emailUtil.sendEmail( to, subject, payload );
    } );
    jobManagerUtil.defineJob( "ball_send_reset_password_email", async( job ) => {
        const { to, subject, payload } = job.data;

        await emailUtil.sendEmail( to, subject, payload );
    } );
};
