const moment = require( "moment" );
const { cancelFinePrecent, validCancelReserveTimeInHour } = require( "./configs" ).constants;

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, dateUtil, sportSiteService, sportSiteRerserveService, sportSiteSessionService, sportSiteSessionTimeService, walletService, walletTransactionService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.dateUtil = dateUtil;
        this.sportSiteService = sportSiteService;
        this.walletService = walletService;
        this.walletTransactionService = walletTransactionService;
        this.sportSiteReserveService = sportSiteRerserveService;
        this.sportSiteSessionService = sportSiteSessionService;
        this.sportSiteSessionTimeService = sportSiteSessionTimeService;
    }

    async add( sportSiteReserveItemObj, { "transaction": t = null } = {} ) {
        const sportSiteReserveItem = await this.models.ReserveItem.create( sportSiteReserveItemObj, { "transaction": t } );

        return sportSiteReserveItem;
    }

    async editById( sportSiteReserveItemUUID, sportSiteReserveItemObj, { "transaction": t = null } = {} ) {
        const sportSiteReserveItem = await this.getById( sportSiteReserveItemUUID, { "transaction": t } );

        await sportSiteReserveItem.update( sportSiteReserveItemObj, { "transaction": t } );
    }

    async editByCode( sportSiteReserveItemCode, sportSiteReserveItemObj, { "transaction": t = null } = {} ) {
        const sportSiteReserveItem = await this.getByCode( sportSiteReserveItemCode, { "transaction": t } );

        await sportSiteReserveItem.update( sportSiteReserveItemObj, { "transaction": t } );
    }

    async checkById( sportSiteReserveItemUUID ) {
        const nowDate = new Date();
        const sportSiteReserveItem = await this.getById( sportSiteReserveItemUUID );
        const [ sportSiteReserve, sportSiteReserveItemSession ] = await Promise.all( [
            this.sportSiteReserveService.getById( sportSiteReserveItem.reserveUUID ),
            this.sportSiteSessionService.getById( "provider", sportSiteReserveItem.sessionUUID )
        ] );
        const [ reserveItemCard, sportSiteReserveItemSessionTime ] = await Promise.all( [
            this.getCardForOwnerSportSiteById( sportSiteReserve.sportSiteUUID, sportSiteReserveItem.uuid ),
            this.sportSiteSessionTimeService.getById( sportSiteReserveItemSession.sessionTimeUUID )
        ] );
        const checkExpire = await this.sportSiteSessionService.checkExpire( {
            "isDynamic": sportSiteReserveItemSession.isDynamic,
            "startTime": sportSiteReserveItemSessionTime.startTime,
            "endTime": sportSiteReserveItemSessionTime.endTime,
            "date": sportSiteReserveItemSession.date,
            "reservedDate": sportSiteReserveItem.createdAt,
            "validDateRangeInDay": sportSiteReserveItemSession.validDateRangeInDay,
            "nowDate": nowDate
        } );
        
        if ( sportSiteReserveItem.acceptStatus === true ) {
            return {
                "success": false,
                "acceptStatus": sportSiteReserveItem.acceptStatus,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "بلیط مورد نظر استفاده شده است"
            };
        } else if ( sportSiteReserveItem.acceptStatus === false ) {
            return {
                "success": false,
                "acceptStatus": sportSiteReserveItem.acceptStatus,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "بلیط مورد نظر رد شده است"
            };
        } else if ( checkExpire ) {
            return {
                "success": false,
                "sessionExpired": true,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "تاریخ بلیط مورد نظر منقضی شده است"
            };
        }
        return {
            "success": true,
            "reserveItemCard": reserveItemCard,
            "message": "بلیط معتبر است"
        };
    }

    async checkByCode( sportSiteReserveItemCode ) {
        const nowDate = new Date();
        const sportSiteReserveItem = await this.getByCode( sportSiteReserveItemCode );
        const [ sportSiteReserve, sportSiteReserveItemSession ] = await Promise.all( [
            this.sportSiteReserveService.getById( sportSiteReserveItem.reserveUUID ),
            this.sportSiteSessionService.getById( "provider", sportSiteReserveItem.sessionUUID )
        ] );
        const [ reserveItemCard, sportSiteReserveItemSessionTime ] = await Promise.all( [
            this.getCardForOwnerSportSiteById( sportSiteReserve.sportSiteUUID, sportSiteReserveItem.uuid ),
            this.sportSiteSessionTimeService.getById( sportSiteReserveItemSession.sessionTimeUUID )
        ] );
        const checkExpire = await this.sportSiteSessionService.checkExpire( {
            "isDynamic": sportSiteReserveItemSession.isDynamic,
            "startTime": sportSiteReserveItemSessionTime.startTime,
            "endTime": sportSiteReserveItemSessionTime.endTime,
            "date": sportSiteReserveItemSession.date,
            "reservedDate": sportSiteReserveItem.createdAt,
            "validDateRangeInDay": sportSiteReserveItemSession.validDateRangeInDay,
            "nowDate": nowDate
        } );
        
        
        if ( !sportSiteReserveItemSession.isMultiUse && sportSiteReserveItem.acceptStatus === true ) {
            return {
                "success": false,
                "acceptStatus": sportSiteReserveItem.acceptStatus,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "بلیط مورد نظر استفاده شده است"
            };
        } else if ( sportSiteReserveItem.acceptStatus === false ) {
            return {
                "success": false,
                "acceptStatus": sportSiteReserveItem.acceptStatus,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "بلیط مورد نظر رد شده است"
            };
        } else if ( checkExpire ) {
            return {
                "success": false,
                "acceptStatus": sportSiteReserveItem.acceptStatus,
                "sessionDate": sportSiteReserveItemSession.date,
                "reserveItemCard": reserveItemCard,
                "message": "تاریخ بلیط مورد نظر منقضی شده است"
            };
        }
        return {
            "success": true,
            "reserveItemCard": reserveItemCard,
            "message": "بلیط معتبر است"
        };
    }

    async removeById( sportSiteReserveItemUUID ) {
        const sportSiteReserveItem = await this.getById( sportSiteReserveItemUUID );
        const sportSiteReserve = await this.sportSiteReserveService.getById( sportSiteReserveItem.reserveUUID, { "getReserveItems": false } );
        const sportSiteReserveDate = sportSiteReserve.createdAt;
        const removeReserveDate = new Date();
        const sportSiteReserveTimePeriod = Math.abs( removeReserveDate - sportSiteReserveDate ) / 36e5;
        const [ sportSite, sportSiteSession, sportSiteWallet, userWallet ] = await Promise.all( [
            this.sportSiteService.getById( sportSiteReserve.sportSiteUUID ),
            this.sportSiteSessionService.getById( "customer", sportSiteReserveItem.sessionUUID ),
            this.walletService.getForOwnerResource( sportSiteReserve.sportSiteUUID ),
            this.walletService.getForOwnerResource( sportSiteReserve.userUUID )
        ] );
        const finalReserveItemPrice = sportSiteReserve.finalPrice;
        const finalReserveItemPriceWithCancelFineApplied = finalReserveItemPrice * ( ( 100 - cancelFinePrecent ) / 100 );
        
        if ( sportSiteReserveTimePeriod < validCancelReserveTimeInHour ) {
            await this.sequelizeDbObj.transaction( {
                "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
            }, ( t ) => {
                return Promise.all( [
                    this.walletTransactionService.add( {
                        "amount": finalReserveItemPriceWithCancelFineApplied,
                        "transactionType": "inc",
                        "description": `لغو رزرو از مجموعه ی ${sportSite.name}`,
                        "walletUUID": userWallet.uuid
                    }, { "transaction": t } ),
                    this.walletTransactionService.add( {
                        "amount": finalReserveItemPrice,
                        "transactionType": "dec",
                        "description": "لغو رزو",
                        "walletUUID": sportSiteWallet.uuid
                    }, { "transaction": t } ),
                    userWallet.update( {
                        "amount": this.sequelizeDbObj.literal( `amount + ${finalReserveItemPriceWithCancelFineApplied}` )
                    }, { "transaction": t } ),
                    sportSiteWallet.update( {
                        "amount": this.sequelizeDbObj.literal( `amount - ${finalReserveItemPrice}` )
                    }, { "transaction": t } ),
                    sportSiteReserveItem.destroy( { "transaction": t } ),
                    sportSiteSession.update( { "reservesCount": this.sequelizeDbObj.literal( `"reservesCount" - ${sportSiteReserveItem.count}` ) }, { "transaction": t } )
                ] );
            } );
        } else {
            return this.errorUtil.throwClientError( "به علت گذشتن حداقل 24 ساعت از زمان رزرو امکان لغو وجود ندارد", 400 );
        }
    }

    async getById( sportSiteReserveItemUUID, { "transaction": t = null } = {} ) {
        const sportSiteReserveItem = await this.models.ReserveItem.findByPk( sportSiteReserveItemUUID, { "transaction": t } );

        if ( !sportSiteReserveItem ) {
            return this.errorUtil.throwClientError( "چنین آیتم رزروی ثبت نشده است", 400 );
        }
        return sportSiteReserveItem;
    }

    async getByCode( sportSiteReserveItemCode, { "transaction": t = null } = {} ) {
        const sportSiteReserveItem = await this.models.ReserveItem.findOne( {
            "where": {
                "code": {
                    [ this.sequelizeObj.Op.eq ]: sportSiteReserveItemCode
                }
            }
        }, { "transaction": t } );

        if ( !sportSiteReserveItem ) {
            return this.errorUtil.throwClientError( "چنین آیتم رزروی ثبت نشده است", 400 );
        }
        return sportSiteReserveItem;
    }

    async getAllForReserve( reserveUUID, { pageNumber = null, pageSize = null, odataStr = null } = {} ) {
        const queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};

        queryObj.where = queryObj.where ? queryObj.where : {};
        if ( pageNumber && pageSize ) {
            queryObj.offset = ( pageNumber - 1 ) * pageSize;
            queryObj.limit = pageSize;
        }
        queryObj.where.reserveUUID = {
            [ this.sequelizeObj.Op.eq ]: reserveUUID
        };
        return await this.models.ReserveItem.findAll( queryObj );
    }

    async getAllForSession( sessionUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            queryObj.where.sessionUUID = {
                [ this.sequelizeObj.Op.eq ]: sessionUUID
            };
        }
        return await this.models.ReserveItem.findAll( queryObj );
    }

    async getAllCardsForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getOnlyValidCards = false } = {} ) {
        const nowDate = new Date();
        const nowDateStr = moment( nowDate ).format( "YYYY-MM-DD HH:mm:ss +03:30" );

        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.attributes = [ "uuid", "code", "count" ];
            queryObj.include = [];
            queryObj.include.push(
                {
                    "required": true,
                    "model": this.models.Reserve,
                    "as": "reserve",
                    "attributes": [ "uuid" ],
                    "where": {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    "include": [
                        {
                            "required": true,
                            "model": this.models.SportSite,
                            "as": "sportSite",
                            "attributes": [ "uuid", "name", "mainPicUrl" ],
                            "include": [
                                {
                                    "required": true,
                                    "model": this.models.Address,
                                    "as": "address",
                                    "attributes": [ "area" ]
                                }
                            ]
                        }
                    ]
                }
            );
            queryObj.include.push(
                {
                    "required": true,
                    "model": this.models.Session,
                    "as": "session",
                    "include": [
                        {
                            "required": true,
                            "model": this.models.SessionTime,
                            "as": "sessionTime",
                            "attributes": [ "startTime" ],
                            "where": getOnlyValidCards || getOnlyValidCards === "true" ? {
                                [ this.sequelizeObj.Op.or ]: [
                                    this.sequelizeDbObj.literal( `( "isDynamic" = false and '${nowDateStr}' < CONCAT( "date",' ',"startTime")::timestamp )` ),
                                    this.sequelizeDbObj.literal( `( "isDynamic" = true  and '${nowDateStr}' <  date_trunc( 'day', ( "reserve"."createdAt" + interval '1' day * "session"."validDateRangeInDay" ) ) + "startTime" )` )
                                ]
                            } : {}
                        }
                    ],
                    "attributes": getOnlyValidCards || getOnlyValidCards === "true" ? [ "uuid", "date" ] : [
                        "uuid",
                        "date",
                        [
                            this.sequelizeDbObj.literal(
                                `case when "isDynamic" = false then ( '${nowDateStr}' < CONCAT("date",' ',"startTime")::timestamp )
                                else ('${nowDateStr}' < ( date_trunc( 'day', ("reserve"."createdAt" + interval '1' day * "session"."validDateRangeInDay") ) + "startTime" ) ) end`
                            ),
                            "isValidSessionTime"
                        ]
                    ]
                }
            );
            queryObj.order = [ [ { "model": this.models.Session, "as": "session" }, "date", "ASC" ], [ { "model": this.models.Session, "as": "session" }, { "model": this.models.SessionTime, "as": "sessionTime" }, "startTime", "ASC" ] ];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        const reserveItemCards = await this.models.ReserveItem.findAll( queryObj );

        return { reserveItemCards };
    }

    async getCardForOwnerSportSiteById( sportSiteUUID, sportSiteReserveItemUUID ) {
        const queryObj = {};

        queryObj.where = {
            "uuid": {
                [ this.sequelizeObj.Op.eq ]: sportSiteReserveItemUUID
            }
        };
        queryObj.attributes = [ "uuid", "count" ];
        queryObj.include = [];
        queryObj.include.push(
            {
                "required": true,
                "model": this.models.Reserve,
                "as": "reserve",
                "attributes": [ "uuid" ],
                "where": {
                    "sportSiteUUID": {
                        [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                    }
                },
                "include": [
                    {
                        "model": this.models.User,
                        "as": "user",
                        "attributes": [ "name" ]
                    }
                ]
            }
        );
        queryObj.include.push(
            {
                "required": true,
                "model": this.models.Session,
                "as": "session",
                "attributes": [ "uuid", "date", "sportType", "adultType", "qualityType" ],
                "include": [
                    {
                        "required": true,
                        "model": this.models.SessionTime,
                        "as": "sessionTime",
                        "attributes": [ "startTime", "endTime" ]
                    }
                ]
            }
        );
        return await this.models.ReserveItem.findOne( queryObj );
    }

    async getAllCardsForOwnerSportSite( sportSiteUUID, { pageNumber = null, pageSize = null, odataStr = null, sessionDateStr = null, userName = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.attributes = [ "uuid", "count" ];
            queryObj.include = [];
            queryObj.include.push(
                {
                    "required": true,
                    "model": this.models.Reserve,
                    "as": "reserve",
                    "attributes": [ "uuid" ],
                    "where": {
                        "sportSiteUUID": {
                            [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                        }
                    },
                    "include": [
                        {
                            "model": this.models.User,
                            "as": "user",
                            "attributes": [ "name" ],
                            "where": userName ? {
                                "name": {
                                    [ this.sequelizeObj.Op.like ]: `%${userName}%`
                                }
                            } : {}
                        }
                    ]
                }
            );
            const sessionDate = sessionDateStr ? moment( sessionDateStr, "YYYY-MM-DD" ).toDate() : new Date();
           
            queryObj.include.push(
                {
                    "required": true,
                    "model": this.models.Session,
                    "as": "session",
                    "attributes": [ "uuid", "date", "sportType", "adultType", "qualityType" ],
                    "where": {
                        "date": {
                            [ this.sequelizeObj.Op.gte ]: sessionDate
                        }
                    },
                    "include": [
                        {
                            "required": true,
                            "model": this.models.SessionTime,
                            "as": "sessionTime",
                            "attributes": [ "startTime", "endTime" ]
                        }
                    ]
                }
            );
            queryObj.order = [ [ { "model": this.models.Session, "as": "session" }, { "model": this.models.SessionTime, "as": "sessionTime" }, "startTime", "ASC" ] ];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
        }
        return await this.models.ReserveItem.findAll( queryObj );
    }

    async getNearestReserveForUser( userUUID, nowDateStr ) {
        const queryObj = {};

        queryObj.where = {};
        queryObj.limit = 1;
        queryObj.attributes = [ "uuid" ];
        queryObj.include = [];
        queryObj.include.push(
            {
                "model": this.models.Reserve,
                "as": "reserve",
                "attributes": [ "uuid" ],
                "where": {
                    "userUUID": {
                        [ this.sequelizeObj.Op.eq ]: userUUID
                    }
                }
            }
        );
        queryObj.include.push(
            {
                "model": this.models.Session,
                "as": "session",
                "include": [
                    {
                        "model": this.models.SessionTime,
                        "as": "sessionTime",
                        "attributes": [ "startTime" ],
                        "where": {
                            [ this.sequelizeObj.Op.and ]: [
                                this.sequelizeObj.literal( `'${nowDateStr}' < CONCAT("date",' ',"startTime")::timestamp` )
                            ]
                        }
                    }
                ]
            }
        );
        queryObj.order = [ [ { "model": this.models.Session, "as": "session" }, "date", "ASC" ], [ { "model": this.models.Session, "as": "session" }, { "model": this.models.SessionTime, "as": "sessionTime" }, "startTime", "ASC" ] ];
        return await this.models.ReserveItem.findOne( queryObj );
    }

    async getNearstReserveItemTimeFromNowForUser( userUUID ) {
        const nowDate = new Date();
        const nowDateStr = moment( nowDate ).format( "YYYY-MM-DD HH:mm:ss +03:30" );
        const nearestReserveItem = await this.getNearestReserveForUser( userUUID, nowDateStr );

        if ( nearestReserveItem ) {
            const nearestReserveItemDate = moment( `${nearestReserveItem.session.date} ${nearestReserveItem.session.sessionTime.startTime}`, "YYYY-MM-DD HH:mm" ).toDate();
            const fromNearestReserveItemTimeInMs = Math.abs( nearestReserveItemDate - nowDate );
            const fromNearestReserveItemTimer = await this.dateUtil.msToDHM( fromNearestReserveItemTimeInMs );

            return { "fromNearestReserveItemTimer": fromNearestReserveItemTimer };
        }
        return null;
    }

    async countAllForSession( sessionUUID ) {
        const queryObj = {};

        queryObj.where = queryObj.where ? queryObj.where : {};
        queryObj.where.sessionUUID = {
            [ this.sequelizeObj.Op.eq ]: sessionUUID
        };
        return await this.models.ReserveItem.count( queryObj );
    }
}
module.exports = Logics;
