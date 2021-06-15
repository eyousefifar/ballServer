const
    fastifyPlugin = require( "fastify-plugin" ),
    handlers = require( "./handlers" ),
    routes = require( "./routes" ),
    // apis
    likes = require( "./apis/like" ),
    media = require( "./apis/media" ),
    comments = require( "./apis/comments" ),
    sessionTimes = require( "./apis/sessionTimes" ),
    sessions = require( "./apis/sessions" ),
    hdates = require( "./apis/hdates" ),
    rates = require( "./apis/rates" ),
    reserves = require( "./apis/reserves" ),
    supportTickets = require( "./apis/supportTickets" ),
    wallets = require( "./apis/wallets" ),
    workPlans = require( "./apis/workPlans" ),
    discounts = require( "./apis/discounts" );
    
module.exports = async function( fastify, opts ) {
    fastify.register( fastifyPlugin( handlers ) );
    fastify.register( routes );
    // register apis
    fastify.register( media, { "prefix": "/media" } );
    fastify.register( comments, { "prefix": "/comments" } );
    fastify.register( sessionTimes, { "prefix": "/sessionTimes" } );
    fastify.register( sessions, { "prefix": "/sessions" } );
    fastify.register( hdates, { "prefix": "/hdates" } );
    fastify.register( rates, { "prefix": "/rates" } );
    fastify.register( likes, { "prefix": "/likes" } );
    fastify.register( reserves, { "prefix": "/reserves" } );
    fastify.register( supportTickets, { "prefix": "/supportTickets" } );
    fastify.register( workPlans, { "prefix": "/workPlans" } );
    fastify.register( wallets, { "prefix": "/wallets" } );
    fastify.register( discounts, { "prefix": "/discounts" } );
};

