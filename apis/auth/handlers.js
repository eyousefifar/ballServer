module.exports = async( fastify, opts ) => {
    const httpHandlers = {
        "getNewAccessToken": async( req, reply ) => {
            const { role } = req.params;
            const { email, phone, refreshToken, deviceToken } = req.body;

            return await fastify.authService.createAccessTokenByRefreshToken( role, refreshToken, { email, phone, deviceToken } );
        },
        "loginByEmailHandler": async( req, reply ) => {
            let result;
            const { role } = req.params;
            const { email, password, deviceToken } = req.body;
        
            if ( role === "customer" ) {
                result = await fastify.authService.loginCustomerByEmail( email, password, { deviceToken } );
            } else if ( role === "provider" ) {
                result = await fastify.authService.loginProviderByEmail( email, password, { deviceToken } );
            } else if ( role === "providerAssistant" ) {
                result = await fastify.authService.loginProviderAssistantByEmail( email, password, { deviceToken } );
            } else if ( role === "admin" ) {
                result = await fastify.authService.loginAdminByEmail( email, password );
            } else {
                reply.status( 404 ).send();
            }
            reply.status( 200 ).send( result );
        },
        "loginByPhoneSubmitRequestHandler": async( req, reply ) => {
            const { role } = req.params;
            const { phone, deviceToken } = req.body;
            let result;
        
            if ( role === "customer" ) {
                result = await fastify.authService.loginCustomerByPhoneSubmitRequest( phone, { deviceToken } );
            } else if ( role === "provider" ) {
                result = await fastify.authService.loginProviderByPhoneSubmitRequest( phone, { deviceToken } );
            } else if ( role === "providerAssistant" ) {
                result = await fastify.authService.loginProviderAssistantByPhoneSubmitRequest( phone, { deviceToken } );
            } else {
                reply.status( 404 ).send();
            }
            reply.status( 200 ).send( result );
        },
        "loginByPhoneHandler": async( req, reply ) => {
            const { key, phone, deviceToken } = req.body;
            const result = await fastify.authService.loginUserByPhone( phone, key, { deviceToken } );
            
            reply.status( 200 ).send( result );
        },
        "checkUserExistByEmailOrPhoneHandler": async( req, reply ) => {
            const { email, phone } = req.body;
            const { role } = req.params;
            let result;

            if ( role === "customer" ) {
                if ( email ) {
                    result = await fastify.userService.checkExistByEmail( "customer", email );
                }
                if ( phone ) {
                    result = await fastify.userService.checkExistByPhone( "customer", phone );
                }
            } else if ( role === "provider" ) {
                if ( email ) {
                    result = await fastify.userService.checkExistByEmail( "provider", email );
                }
                if ( phone ) {
                    result = await fastify.userService.checkExistByPhone( "provider", phone );
                }
            } else if ( role === "providerAssistant" ) {
                if ( email ) {
                    result = await fastify.userService.checkExistByEmail( "providerAssistant", email );
                }
                if ( phone ) {
                    result = await fastify.userService.checkExistByPhone( "providerAssistant", phone );
                }
            } else {
                reply.status( 404 ).send();
            }
            reply.status( 200 ).send( result );
        },
        "logoutHandler": async( req, reply ) => {
            const [ , token ] = req.headers.authorization.split( ' ' );
    
            await fastify.authService.logout( token );
            reply.status( 200 ).send();
        },
        "signupCustomerByEmailHandler": async( req, reply ) => {
            const { userObj, customerObj, shareCode, deviceToken } = req.body;
            const result = await fastify.authService.signupCustomerByEmail( userObj, customerObj, { shareCode, deviceToken } );

            reply.status( 201 ).send( result );
        },
        "signupProviderByEmailHandler": async( req, reply ) => {
            const { userObj, providerObj, deviceToken } = req.body;
            const result = await fastify.authService.signupProviderByEmail( userObj, providerObj, { deviceToken } );

            reply.status( 201 ).send( result );
        },
        "signupProviderAssistantByEmailHandler": async( req, reply ) => {
            const { userObj, providerAssistantObj, deviceToken } = req.body;
            const result = await fastify.authService.signupProviderAssistantByEmail( userObj, providerAssistantObj, { deviceToken } );

            reply.status( 201 ).send( result );
        },
        "signupCustomerByPhoneHandler": async( req, reply ) => {
            const { phoneConfirmKey, shareCode, userObj, customerObj, deviceToken } = req.body;
            const result = await fastify.authService.signupCustomerByPhone( phoneConfirmKey, userObj, customerObj, { shareCode, deviceToken } );

            reply.status( 201 ).send( result );
        },
        "signupProviderByPhoneHandler": async( req, reply ) => {
            const { phoneConfirmKey, userObj, providerObj, deviceToken } = req.body;
            const result = await fastify.authService.signupProviderByPhone( phoneConfirmKey, userObj, providerObj, { deviceToken } );

            reply.status( 201 ).send( result );
        },
        "signupProviderAssistantByPhoneHandler": async( req, reply ) => {
            const { phoneConfirmKey, userObj, providerAssistantObj, deviceToken } = req.body;
            const result = await fastify.authService.signupProviderAssistantByPhone( phoneConfirmKey, userObj, providerAssistantObj, { deviceToken } );

            reply.status( 201 ).send( result );
        },
        "submitVerifyEmailRequestHandler": async( req, reply ) => {
            const { email } = req.body;
    
            await fastify.authService.submitVerifyEmailRequest( email );
            reply.status( 200 ).send();
        },
        "submitVerifyPhoneRequestHandler": async( req, reply ) => {
            const { phone } = req.body;

            const result = await fastify.authService.submitVerifyPhoneRequest( phone );
            reply.status( 200 ).send( result );
        },
        "verifyEmailHandler": async( req, reply ) => {
            const { key } = req.params;
    
            await fastify.authService.verifyEmail( key );
            reply.status( 200 ).send();
        },
        "verifyPhoneHandler": async( req, reply ) => {
            const { key, phone } = req.body;
            const result = await fastify.authService.verifyPhone( phone, key );

            reply.status( 200 ).send( result );
        },
        "submitResetPasswordRequest": async( req, reply ) => {
            const { email } = req.body;
    
            await fastify.authService.submitResetPasswordRequest( email );
            reply.status( 200 ).send();
        },
        "resetPasswordHandler": async( req, reply ) => {
            const { password, token } = req.body;
    
            await fastify.authService.resetPassword( token, password );
            reply.status( 200 ).send();
        }
    };
    
    fastify.decorate( "httpHandlers", httpHandlers );
};

