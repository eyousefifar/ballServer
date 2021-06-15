module.exports = ( { jobManagerUtil }, sessionManagerService ) => {
    jobManagerUtil.defineJob( "ball_generate_session_times", async( job ) => {
        const { sportSiteUUID } = job.data;

        await sessionManagerService.sessionTimeGenerator( sportSiteUUID );
    } );
    jobManagerUtil.defineJob( "ball_generate_sessions", async( job ) => {
        const { sportSiteUUID, startDate, endDate } = job.data;

        await sessionManagerService.sessionGenerator( sportSiteUUID, startDate, endDate );
    } );
};
