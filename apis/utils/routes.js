module.exports = async( fastify, opts ) => {
    const { httpHandlers } = fastify;

    fastify.get( "/getDate", {}, httpHandlers.getDateHandler );
};
