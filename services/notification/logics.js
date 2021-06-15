class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, redisDbClient, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, { jobManagerUtil }, userDeviceService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.redisDbClient = redisDbClient;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.jobManagerUtil = jobManagerUtil;
        this.userDeviceService = userDeviceService;
    }

    async add( notificationObj, { userDeviceTokens = [], sendToAllUserDevices = true } = {}, { "transaction": t = null } = {} ) {
        let reciverIds;
        
        if ( userDeviceTokens.length > 0 ) {
            reciverIds = userDeviceTokens;
        } else if ( sendToAllUserDevices ) {
            const deviceTokenObjs = await this.userDeviceService.getAllForUser( notificationObj.userUUID, {
                "queryObj": {
                    "attributes": [ "deviceToken" ]
                }
            } );

            reciverIds = deviceTokenObjs.map( deviceTokenObj => deviceTokenObj.deviceToken );
        }
        if ( reciverIds.length > 0 ) {
            const [ notification ] = await Promise.all( [
                this.models.Notification.create( notificationObj, { "transaction": t } ),
                this.jobManagerUtil.addJob( "ball_send_notification", {
                    "title": notificationObj.title,
                    "content": notificationObj.content,
                    "reciverIds": reciverIds
                } )
            ] );
    
            return notification;
        }
    }

    async removeById( notificationUUID, { "transaction": t = null } = {} ) {
        throw new Error( "not implemented yet" );
    }

    async getById( notificationUUID, { "transaction": t = null } = {} ) {
        const notification = await this.models.Notification.findByPk( notificationUUID, { "transaction": t } );

        if ( !notification ) {
            return this.errorUtil.throwClientError( "چنین اعلانی ای ثبت نشده است", 404 );
        }
        return notification;
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getSportSite = true, sportSiteOdataStr = null, getSportSiteAddress = true, sportSiteAddressOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.Notification.findAll( queryObj );
    }
}

module.exports = Logics;
