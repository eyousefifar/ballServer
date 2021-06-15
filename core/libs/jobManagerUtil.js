BullQueue = require( "bull" );

class BullStrategy {
    constructor( opts ) {
        this.queues = {};
        for ( const queueName of opts.queueNames ) {
            this.queues[ queueName ] = new BullQueue( queueName, { "redis": { "port": opts.port, "host": opts.host, "password": opts.password } } );
        }
    }

    async addJob( queueName, jobData ) {
        const queue = this.getQueue( queueName );

        await queue.add( jobData );
    }

    async defineJob( queueName, job ) {
        const queue = this.getQueue( queueName );

        await queue.process( job );
    }

    getQueue( queueName ) {
        if ( !this.queues[ queueName ] ) {
            throw new Error( "queue not found" );
        }
        return this.queues[ queueName ];
    }
}

module.exports = { BullStrategy };
