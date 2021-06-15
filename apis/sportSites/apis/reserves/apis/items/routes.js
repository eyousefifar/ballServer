const { sportSiteReserveItemForEditSchema, sportSiteReserveItemForEditByCodeSchema, sportSiteReserveItemForRemoveSchema,
    sportSiteReserveItemForGetSchema, sportSiteReserveItemForCheckSchema, sportSiteReserveItemForCheckByCodeSchema,
    sportSiteReserveItemForGetCardSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.put( "/:sportSiteReserveItemUUID", {
        "schema": sportSiteReserveItemForEditSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveItemUUID )
        ]
    }, httpHandlers.editReserveItemHandler );

    fastify.put( "/code/:code", {
        "schema": sportSiteReserveItemForEditByCodeSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => `sportSiteReserveItem_${req.params.code}` )
        ]
    }, httpHandlers.editReserveItemByCodeHandler );

    fastify.delete( "/:sportSiteReserveItemUUID",
        {
            "schema": sportSiteReserveItemForRemoveSchema,
            "preHandler": [
                fastify.authenticate( fastify.tokenUtil ),
                fastify.authorizeByRoles( [ "customer" ] ),
                fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveItemUUID )
            ]
        }, httpHandlers.removeSportSiteReserveItemHandler );

    fastify.get( "/:sportSiteReserveItemUUID/check", {
        "schema": sportSiteReserveItemForCheckSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveItemUUID )
        ]
    }, httpHandlers.checkReserveItemHandler );

    fastify.get( "/code/:code/check", {
        "schema": sportSiteReserveItemForCheckByCodeSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => `sportSiteReserveItem_${req.params.code}` )
        ]
    }, httpHandlers.checkReserveItemByCodeHandler );

    fastify.get( "/:sportSiteReserveItemUUID/card/userType/provider", {
        "schema": sportSiteReserveItemForGetCardSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveItemUUID )
        ]
    }, httpHandlers.checkReserveItemHandler );

    fastify.get( "/:sportSiteReserveItemUUID", {
        "schema": sportSiteReserveItemForGetSchema,
        "preHandler": [
            fastify.authenticate( fastify.tokenUtil ),
            fastify.authorizeByRoles( [ "customer", "provider" ] ),
            fastify.authorizeResource( fastify, ( req ) => req.params.sportSiteReserveItemUUID )
        ]
    }, httpHandlers.getReserveItemHandler );
};
