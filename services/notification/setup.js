module.exports = ( { jobManagerUtil }, notificationUtil ) => {
    jobManagerUtil.defineJob( "ball_send_notification", async( job ) => {
        const { title, content, reciverIds } = job.data;

        if ( reciverIds ) {
            return await notificationUtil.send( reciverIds, title, content );
        }
        return await notificationUtil.sendToAll( title, content );
    } );
};
