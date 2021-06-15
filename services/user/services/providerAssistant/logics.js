class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, userService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
        this.userService = userService;
    }

    async addProviderAssistantUser( user, providerAssistantObj, { "transaction": t = null } = {} ) {
        providerAssistantObj.userUUID = user.uuid;
        
        if ( user.types ) {
            if ( user.types.includes( "providerAssistant" ) ) {
                return this.errorUtil.throwClientError( "چنین کاربری از قبل در سیستم ثبت نام کرده است", 400 );
            }
            user.types.push( "providerAssistant" );
        } else {
            user.types = [ "providerAssistant" ];
        }
        const [ providerAssistant ] = await Promise.all( [
            this.sequelizeCachingUtil.withCache( this.models.ProviderAssistant ).cache().create( providerAssistantObj, { "transaction": t } ),
            user.cache().save( { "transaction": t } )
        ] );
        return providerAssistant;
    }

    async add( providerAssistantObj, { "transaction": t = null } = {} ) {
        const providerAssistant = await this.sequelizeCachingUtil.withCache( this.models.ProviderAssistant ).cache().create( providerAssistantObj, { "transaction": t } );

        return providerAssistant;
    }

    async editById( providerAssistantUUID, providerAssistantObj ) {
        await this.userService.editById( userUUID, providerAssistantObj.userObj );
        const providerAssistant = await this.getById( providerAssistantUUID );

        await providerAssistant.cache().update( providerAssistantObj );
    }

    async getById( providerAssistantUUID, { "transaction": t = null } = {} ) {
        const providerAssistant = await this.sequelizeCachingUtil.withCache( this.models.ProviderAssistant ).cache().findByPk( providerAssistantUUID, { "transaction": t } );

        if ( !providerAssistant ) {
            return this.errorUtil.throwClientError( "چنین همکار ارائه دهنده ای ثبت نشده است", 404 );
        }
        return providerAssistant;
    }
}

module.exports = Logics;
