class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, userService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.userService = userService;
    }

    async addProviderUser( user, providerObj, { "transaction": t = null } = {} ) {
        providerObj.userUUID = user.uuid;
        
        if ( user.types ) {
            if ( user.types.includes( "provider" ) ) {
                return this.errorUtil.throwClientError( "چنین کاربری از قبل در سیستم ثبت نام کرده است", 400 );
            }
            user.types.push( "provider" );
        } else {
            user.types = [ "provider" ];
        }
        const [ provider ] = await Promise.all( [
            this.sequelizeCachingUtil.withCache( this.models.Provider ).cache().create( providerObj, { "transaction": t } ),
            user.cache().save( { "transaction": t } )
        ] );
        return provider;
    }

    async add( providerObj, { "transaction": t = null } = {} ) {
        const provider = await this.sequelizeCachingUtil.withCache( this.models.Provider ).cache().create( providerObj, { "transaction": t } );

        return provider;
    }

    async editById( userUUID, providerObj ) {
        await this.userService.editById( userUUID, providerObj.userObj );
        const provider = await this.getById( userUUID );
        
        await provider.cache().update( providerObj );
    }

    async getById( userUUID, { "transaction": t = null } = {} ) {
        const provider = await this.sequelizeCachingUtil.withCache( this.models.Provider ).cache().findByPk( userUUID, { "transaction": t } );

        if ( !provider ) {
            return this.errorUtil.throwClientError( "چنین ارائه دهنده ای ثبت نشده است", 404 );
        }
        return provider;
    }
}

module.exports = Logics;
