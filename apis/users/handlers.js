const { "maxPageSize": notificationMaxPage } = require( "../../services/notification/configs" ).constants.pagination;

module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "addUserHandler": async( req, reply ) => {
            const userObj = req.body;
            const user = await fastify.userService.add( userObj );
            
            reply.status( 201 ).send( user );
        },
        "editUserHandler": async( req, reply ) => {
            const { userUUID } = req.params;
            const userObj = req.body;

            await fastify.userService.editById( userUUID, userObj );
            reply.status( 200 ).send();
        },
        "getUserHandler": async( req, reply ) => {
            const { userUUID } = req.params;
            const result = await fastify.userService.getById( userUUID );

            reply.status( 200 ).send( result );
        },
        "getUserByTokenHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const result = await fastify.userService.getById( userUUID );

            reply.status( 200 ).send( result );
        },
        "getAllNotificationsForOwnerUserHandler": async( req, reply ) => {
            const userUUID = req.user.uuid;
            const { pageNumber, pageSize = notificationMaxPage, odataStr } = req.query;
            const result = await fastify.notificationService.getAllForOwnerUser( userUUID, { pageNumber, pageSize, odataStr } );

            reply.status( 200 ).send( result );
        }
    };

    fastify.decorate( "httpHandlers", httpHandlers );
};
