const { userForGetAccessTokenSchema, userForLoginByEmailSchema, userForLoginByPhoneSchema, userForLoginByPhoneRequestSchema,
    userForVerifyEmailRequestSchema, userForVerifyEmailSchema, userForVerifyPhoneRequestSchema,
    userForVerifyPhoneSchema, userForResetPasswordRequestSchema, userForResetPasswordSchema,
    userForCheckExistSchema, customerForSignupByEmailSchema, customerForSignupByPhoneSchema,
    providerForSignupByEmailSchema, providerForSignupByPhoneSchema, providerAssistantForSignupByEmailSchema,
    providerAssistantForSignupByPhoneSchema } = require( "./schemas" );

module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.post( "/accessToken/:role", {
        "schema": userForGetAccessTokenSchema
    }, httpHandlers.getNewAccessToken );

    fastify.post( "/check-user-exist/:role", {
        "schema": userForCheckExistSchema
    }, httpHandlers.checkUserExistByEmailOrPhoneHandler );

    fastify.post( "/signup/customer/with-email", {
        "schema": customerForSignupByEmailSchema
    }, httpHandlers.signupCustomerByEmailHandler );

    fastify.post( "/signup/provider/with-email", {
        "schema": providerForSignupByEmailSchema
    }, httpHandlers.signupProviderByEmailHandler );

    fastify.post( "/signup/providerAssistant/with-email", {
        "schema": providerAssistantForSignupByEmailSchema
    }, httpHandlers.signupProviderAssistantByEmailHandler );

    fastify.post( "/signup/customer/with-phone",
        { "schema": customerForSignupByPhoneSchema
        }, httpHandlers.signupCustomerByPhoneHandler );

    fastify.post( "/signup/provider/with-phone",
        { "schema": providerForSignupByPhoneSchema
        }, httpHandlers.signupProviderByPhoneHandler );

    fastify.post( "/signup/providerAssistant/with-phone",
        { "schema": providerAssistantForSignupByPhoneSchema
        }, httpHandlers.signupProviderAssistantByPhoneHandler );

    fastify.post( "/login/:role/with-email",
        { "schema": userForLoginByEmailSchema
        }, httpHandlers.loginByEmailHandler );

    fastify.post( "/login/:role/with-phone/request",
        { "schema": userForLoginByPhoneRequestSchema
        }, httpHandlers.loginByPhoneSubmitRequestHandler );

    fastify.post( "/login/with-phone/callback",
        { "schema": userForLoginByPhoneSchema
        }, httpHandlers.loginByPhoneHandler );

    fastify.get( "/logout", httpHandlers.logoutHandler );
    
    fastify.post( "/email/verify/request", {
        "schema": userForVerifyEmailRequestSchema
    }, httpHandlers.submitVerifyEmailRequestHandler );

    fastify.get( "/email/verify/callback/:key", {
        "schema": userForVerifyEmailSchema
    }, httpHandlers.verifyEmailHandler );

    fastify.post( "/phone/verify/request", {
        "schema": userForVerifyPhoneRequestSchema
        
    }, httpHandlers.submitVerifyPhoneRequestHandler );

    fastify.post( "/phone/verify/callback", {
        "schema": userForVerifyPhoneSchema
    }, httpHandlers.verifyPhoneHandler );

    fastify.post( "/password/reset/request", {
        "schema": userForResetPasswordRequestSchema
    }, httpHandlers.submitResetPasswordRequest );

    fastify.post( "/password/reset/callback", {
        "schema": userForResetPasswordSchema
    }, httpHandlers.resetPasswordHandler );
};
