const moment = require( "moment" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, sportSiteSessionTimeService, sportSiteHdateService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.sportSiteSessionTimeService = sportSiteSessionTimeService;
        this.sportSiteHdateService = sportSiteHdateService;
    }

    async add( userUUID, sportSiteSessionObj ) {
        const sportSiteSessionTime = await this.sportSiteSessionTimeService.getById( sportSiteSessionObj.sessionTimeUUID );
        const sportSite = await this.sportSiteService.getById( sportSiteSessionTime.sportSiteUUID );
        const sportSiteHdate = await this.sportSiteHdateService.getForSportSiteByDate( sportSite.uuid, sportSiteSessionObj.date );
        
        if ( sportSiteHdate ) {
            return this.errorUtil.throwClientError( "این تاریخ در روز های تعطیل ثبت شده و امکان تعریف سانس در آن وجود ندارد", 400 );
        }
        if ( sportSiteSessionObj.genderType ) {
            if ( !sportSite.genderTypes.includes( sportSiteSessionObj.genderType ) ) {
                return this.errorUtil.throwClientError( "چنین جنسیتی برای این سایت ورزشی وجود ندارد", 400 );
            }
        }
        const sportSiteSession = await this.models.Session.create( sportSiteSessionObj );

        await this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteSession.uuid, "all" );
        return sportSiteSession;
    }

    async editById( sportSiteSessionUUID, sportSiteSessionObj ) {
        const sportSiteSession = await this.getById( "provider", sportSiteSessionUUID );
        const sportSite = this.sportSiteService.getById( sportSiteSession.sportSiteUUID );

        if ( sportSiteSessionObj.genderType ) {
            if ( !sportSite.genderTypes.includes( sportSiteSessionObj.genderType ) ) {
                return this.errorUtil.throwClientError( "چنین جنسیتی برای این سایت ورزشی وجود ندارد", 400 );
            }
        }
        if ( sportSiteSessionObj.enableStatus === false && sportSiteSession.reservesCount > 0 ) {
            return this.errorUtil.throwClientError( "امکان ویرایش وجود ندارد", 400 );
        }
        await sportSiteSession.update( sportSiteSessionObj );
    }

    async getById( userType, sportSiteSessionUUID ) {
        const sportSiteSession = await this.models.Session.findByPk( sportSiteSessionUUID );

        if ( !sportSiteSession ) {
            return this.errorUtil.throwClientError( "چنین سانسی برای این سایت ورزشی ثبت نشده است", 404 );
        }
        if ( userType === "customer" && !sportSiteSession.enableStatus ) {
            return this.errorUtil.throwClientError( "چنین سانسی برای این سایت ورزشی ثبت نشده است", 404 );
        }
        sportSiteSession.dataValues.reserveLimit = sportSiteSession.capacity - sportSiteSession.reservesCount;
        return sportSiteSession;
    }

    async getForSportSite( sportSiteUUID, sportSiteSessionUUID, { userType = "customer" } = {} ) {
        const sportSiteSession = await this.getById( userType, sportSiteSessionUUID );
        const sportSiteSessionTime = await this.sportSiteSessionTimeService.getById( sportSiteSession.sessionTimeUUID );

        if ( sportSiteSessionTime.sportSiteUUID !== sportSiteUUID ) {
            return this.errorUtil.throwClientError( "چنین سانسی  برای این سایت ورزشی ثبت نشده است", 400 );
        }
        sportSiteSession.dataValues.reserveLimit = sportSiteSession.capacity - sportSiteSession.reservesCount;
        return sportSiteSession;
    }

    async getAllForSportSite( userType, sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = {};
            queryObj.where = {};
            queryObj.where.sportSiteUUID = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
            queryObj.order = [
                [ "startTime", "ASC" ]
            ];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            queryObj.include = (
                () => {
                    let queryObj;
                    const nowDate = moment( new Date() ).format( "YYYY-MM-DD HH:mm:ss +03:30" );

                    queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
                    queryObj.where = queryObj.where ? queryObj.where : {};
                    queryObj.attributes = queryObj.attributes ? queryObj.attributes : {};
                    queryObj.attributes.include = [
                        [ this.sequelizeDbObj.literal( `"capacity" - "reservesCount"` ), "reserveLimit" ],
                        [ this.sequelizeDbObj.literal( `"discountExpireDate" > '${nowDate}'` ), "isValidDiscount" ]
                    ];
                    if ( userType === "customer" ) {
                        queryObj.attributes.include.push( [ this.sequelizeDbObj.literal( `( '${nowDate}' < ( CONCAT("date",' ',"startTime")::timestamp + ( ("endTime" - "startTime")/2 ) ) )` ), "isValidSessionTime" ] );
                        queryObj.where.enableStatus = {
                            [ this.sequelizeObj.Op.eq ]: true
                        };
                    }
                    return [ {
                        "model": this.models.Session,
                        "as": "sessions",
                        ...queryObj
                    } ];
                }
            )();
        }
        return await this.models.SessionTime.findAll( queryObj );
    }

    async checkExpire( { isDynamic = false, startTime, endTime, date, validDateRangeInDay, reservedDate, nowDate = new Date() } = {} ) {
        const sportSiteSessionStartTime = moment( startTime, "HH:mm" ).toDate();
        const sportSiteSessionEndTime = moment( endTime, "HH:mm" ).toDate();
        const sportSiteSessionPeriod = ( Math.abs( sportSiteSessionEndTime - sportSiteSessionStartTime ) ) / 2;
       
        if ( !isDynamic ) {
            const sportSiteSessionDate = moment( date, "YYYY-MM-DD" ).toDate();

            sportSiteSessionDate.setHours( sportSiteSessionStartTime.getHours(), sportSiteSessionStartTime.getMinutes() );
            sportSiteSessionDate.setMilliseconds( sportSiteSessionDate.getMilliseconds() + sportSiteSessionPeriod );
            if ( nowDate < sportSiteSessionDate ) {
                return false;
            }
        } else {
            const validReserveDate = reservedDate;

            validReserveDate.setDate( reservedDate.getDate() + validDateRangeInDay );
            validReserveDate.setHours( sportSiteSessionStartTime.getHours(), sportSiteSessionStartTime.getMinutes(), sportSiteSessionStartTime.getSeconds() );
            if ( nowDate < validReserveDate ) {
                return false;
            }
        }
        return true;
    }
}

module.exports = Logics;
