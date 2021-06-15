const { Helper } = require( 'casbin' );

class Line {
    p_type;
    v0;
    v1;
    v2;
    v3;
    v4;
    v5;
}

module.exports = class CasbinRedisAdapter {
    redisInstance = null;
    policies = null;
    deliveredOptions = {
        retry_strategy( options ) {
            if ( options.error && options.error.code === 'ECONNREFUSED' ) {
                return new Error( 'The server refused the connection' );
            }
            if ( options.total_retry_time > 1000 * 60 * 60 ) {
                return new Error( 'Retry time exhausted' );
            }
            if ( options.attempt > 10 ) {
                return undefined;
            }
            return Math.min( options.attempt * 100, 300 );
        }
    };

    savePolicyLine( ptype, rule ) {
        const line = new Line();

        line.p_type = ptype;
        if ( rule.length > 0 ) {
            line.v0 = rule[ 0 ];
        }
        if ( rule.length > 1 ) {
            line.v1 = rule[ 1 ];
        }
        if ( rule.length > 2 ) {
            line.v2 = rule[ 2 ];
        }
        if ( rule.length > 3 ) {
            line.v3 = rule[ 3 ];
        }
        if ( rule.length > 4 ) {
            line.v4 = rule[ 4 ];
        }
        if ( rule.length > 5 ) {
            line.v5 = rule[ 5 ];
        }
        return line;
    }

    loadPolicyLine( line, model ) {
        let lineText = line.p_type;

        if ( line.v0 ) {
            lineText += `, ${ line.v0}`;
        }
        if ( line.v1 ) {
            lineText += `, ${ line.v1}`;
        }
        if ( line.v2 ) {
            lineText += `, ${ line.v2}`;
        }
        if ( line.v3 ) {
            lineText += `, ${ line.v3}`;
        }
        if ( line.v4 ) {
            lineText += `, ${ line.v4}`;
        }
        if ( line.v5 ) {
            lineText += `, ${ line.v5}`;
        }
        Helper.loadPolicyLine( lineText, model );
    }

    async storePolicies( policies ) {
        await this.redisInstance.del( 'policies' );
        await this.redisInstance.set( 'policies', JSON.stringify( policies ) );
    }

    reducePolicies( policies, ptype, rule ) {
        let i = rule.length;
        let policyIndex = policies.fieldIndex( ( policy ) => {
            let flag = false;

            flag = policy.p_type === ptype;
            flag = !!( i > 5 && policy.v5 === rule[ 5 ] );
            flag = !!( i > 4 && policy.v4 === rule[ 4 ] );
            flag = !!( i > 3 && policy.v3 === rule[ 3 ] );
            flag = !!( i > 2 && policy.v2 === rule[ 2 ] );
            flag = !!( i > 1 && policy.v0 === rule[ 1 ] );
            return flag;
        } );
        if ( policyIndex !== -1 ) {
            return policies.splice( policyIndex, 1 );
        }
        return [];
    }

    constructor( { redisDbClient } ) {
        if ( redisDbClient ) {
            this.redisInstance = redisDbClient;
        } else {
            throw new Error( "redisDbClient is required" );
        }
    }

    static async newAdapter( options ) {
        const adapter = new CasbinRedisAdapter( options );

        return adapter;
    }

    async loadPolicy( model ) {
        let policies = await this.redisInstance.get( "policies" );

        if ( !policies ) {
            this.policies = [];
        } else {
            this.policies = JSON.parse( policies );
            this.policies.forEach( ( policy, index ) => {
                this.loadPolicyLine( policy, model );
            } );
        }
    }

    async savePolicy( model ) {
        const policyRuleAST = model.model.get( "p" );
        const groupingPolicyAST = model.model.get( "g" );
        let policies = [];

        for ( const [ ptype, ast ] of policyRuleAST ) {
            for ( const rule of ast.policy ) {
                const line = this.savePolicyLine( ptype, rule );

                policies.push( line );
            }
        }
        if ( groupingPolicyAST ) {
            for ( const [ ptype, ast ] of groupingPolicyAST ) {
                for ( const rule of ast.policy ) {
                    const line = this.savePolicyLine( ptype, rule );

                    policies.push( line );
                }
            }
        }
        await this.storePolicies( policies );
    }

    async addPolicy( sec, ptype, rule ) {
        const line = this.savePolicyLine( ptype, rule );

        this.policies.push( line );
        await this.storePolicies( this.policies );
    }

    async removePolicy( sec, ptype, rule ) {
        let result = this.reducePolicies( this.policies, ptype, rule );

        if ( result.length ) {
            this.policies = result;
            await this.storePolicies( this.policies );
        } else {
            throw new Error( "No Policy Found" );
        }
    }

    async removeFilteredPolicy( sec, ptype, fieldIndex, ...fieldValues ) {
        return new Error( "not implemented" );
    }
};
