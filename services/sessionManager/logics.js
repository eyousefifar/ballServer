const moment = require( "moment" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, sportSiteService, sportSiteHdateService, sportSiteWorkPlanService, sportSiteSessionTimeService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.sportSiteService = sportSiteService;
        this.sportSiteHdateService = sportSiteHdateService;
        this.sportSiteWorkPlanService = sportSiteWorkPlanService;
        this.sportSiteSessionTimeService = sportSiteSessionTimeService;
        this.dayOfWeeks = {
            "جمعه": 0,
            "پنج شنبه": 1,
            "چهارشنبه": 2,
            "سه شنبه": 3,
            "دو شنبه": 4,
            "یک شنبه": 5,
            "شنبه": 6
        };
    }

    async sessionTimeGenerator( sportSiteUUID ) {
        const sportSite = await this.sportSiteService.getById( sportSiteUUID );
        const sportSiteSessionTimeInHour = sportSite.sessionTimeInHour;
        const sportSiteWorkPlans = await this.sportSiteWorkPlanService.getAllForSportSite( sportSiteUUID );

        for ( const sportSiteWorkPlan of sportSiteWorkPlans ) {
            let sportSiteSessionTime;

            if ( !sportSiteSessionTimeInHour ) {
                const sportSiteWorkPlanStartTime = sportSiteWorkPlan.startTime;
                const sportSiteWorkPlanEndTime = sportSiteWorkPlan.endTime;
    
                if ( !( await this.sportSiteSessionTimeService.checkExistByTimes( sportSiteWorkPlanStartTime, sportSiteWorkPlanEndTime ) ) ) {
                    sportSiteSessionTime = await this.models.SessionTime.create( {
                        "startTime": sportSiteWorkPlanStartTime,
                        "endTime": sportSiteWorkPlanEndTime,
                        "sportSiteUUID": sportSiteUUID
                    } );
                }
            } else {
                let sportSiteWorkPlanStartTime = moment( sportSiteWorkPlan.startTime, "HH:mm:ss" ).toDate();
                let sportSiteWorkPlanEndTime = moment( sportSiteWorkPlan.endTime, "HH:mm:ss" ).toDate();
                let sportSiteWorkPlanPeriodEndTime = new Date( sportSiteWorkPlanStartTime.getTime() );

                while ( sportSiteWorkPlanStartTime < sportSiteWorkPlanEndTime ) {
                    sportSiteWorkPlanPeriodEndTime.setHours( sportSiteWorkPlanPeriodEndTime.getHours() + sportSiteSessionTimeInHour );

                    const sportSiteWorkPlanStartTimeStr = moment( sportSiteWorkPlanStartTime, moment.ISO_8601 ).format( "HH:mm:ss" );
                    const sportSiteWorkPlanPeriodEndTimeStr = moment( sportSiteWorkPlanPeriodEndTime, moment.ISO_8601 ).format( "HH:mm:ss" );

                    if ( !( await this.sportSiteSessionTimeService.checkExistByTimes( sportSiteWorkPlanStartTimeStr, sportSiteWorkPlanPeriodEndTimeStr ) ) ) {
                        sportSiteSessionTime = await this.models.SessionTime.create( {
                            "startTime": sportSiteWorkPlanStartTimeStr,
                            "endTime": sportSiteWorkPlanPeriodEndTimeStr,
                            "sportSiteUUID": sportSiteUUID
                        } );
                    }
                    sportSiteWorkPlanStartTime = new Date( sportSiteWorkPlanPeriodEndTime.getTime() );
                }
                
            }
            if ( sportSiteSessionTime ) {
                await this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSessionTime.uuid, "all" );
            }
        }
    }


    /*
        template format example
        {
            items:[
                {
                    day:0,
                    sportType: "شنا",
                    adultType: "بزرگسالان",
                    qualityType": "معمولی",
                    capacity: 20,
                    price: 10000
                },
                {
                    day:1,
                    sportType: "شنا",
                    adultType: "بزرگسالان",
                    qualityType": "معمولی",
                    capacity: 20,
                    price: 10000
                }
            ],
            constants:{
                isDynamic: true,
                isMultiUse: true,
                validDateRangeInDay: 30
            }
        }
        
    */
    async sessionGenerator( sportSiteUUID, startDateStr, endDateStr, template ) {
        const startDate = moment( startDateStr, "YYYY-MM-DD" ).toDate();
        const endDate = moment( endDateStr, "YYYY-MM-DD" ).toDate();
        const sportSite = await this.sportSiteService.checkExistById( sportSiteUUID );
        const sportSiteWorkPlans = await this.sportSiteWorkPlanService.getAllForSportSite( sportSiteUUID );
        let sportSiteSessions = [];
        let dayTemplateItems = [];
        let sportSiteSessionTimeUUIDs;

        while ( startDate < endDate ) {
            const sportSiteHdate = await this.sportSiteHdateService.getForSportSiteByDate( sportSite.uuid, startDate );
        
            if ( sportSiteHdate ) {
                return this.errorUtil.throwClientError( "این تاریخ در روز های تعطیل ثبت شده و امکان تعریف سانس در آن وجود ندارد", 400 );
            }
            const dayOfWeekIndex = moment( startDateStr, "YYYY-MM-DD" ).day();

            for ( const sportSiteWorkPlan of sportSiteWorkPlans ) {
                if ( sportSiteWorkPlan.day ) {
                    const sportSiteWorkPlanDayIndex = this.dayOfWeeks[ sportSiteWorkPlan.day ];

                    if ( dayOfWeekIndex === sportSiteWorkPlanDayIndex ) {
                        sportSiteSessionTimeUUIDs = ( await this.sportSiteSessionTimeService.getAllBetweenTimes( sportSiteWorkPlan.startTime, sportSiteWorkPlan.endTime, { "odataStr": "$select=uuid" } ) ).map( sportSiteSessionTimeUUIDObj => sportSiteSessionTimeUUIDObj.uuid );
                    }
                } else if ( sportSiteWorkPlan.startDay && sportSiteWorkPlan.endDay ) {
                    const sportSiteWorkPlanStartDayIndex = this.dayOfWeeks[ sportSiteWorkPlan.day ];
                    const sportSiteWorkPlanEndDayIndex = this.dayOfWeeks[ sportSiteWorkPlan.day ];

                    if ( dayOfWeekIndex >= sportSiteWorkPlanStartDayIndex && dayOfWeekIndex <= sportSiteWorkPlanEndDayIndex ) {
                        sportSiteSessionTimeUUIDs = ( await this.sportSiteSessionTimeService.getAllBetweenTime( sportSiteWorkPlan.startTime, sportSiteWorkPlan.endTime, { "odataStr": "$select=uuid" } ) ).map( sportSiteSessionTimeUUIDObj => sportSiteSessionTimeUUIDObj.uuid );
                    }
                } else {
                    throw new Error( "work plan format is not true" );
                }
                for ( const templateItem of template.items ) {
                    if ( this.dayOfWeeks[ templateItem.day ] === dayOfWeekIndex ) {
                        dayTemplateItems.push( templateItem );
                    }
                }
                for ( const sportSiteSessionTimeUUID of sportSiteSessionTimeUUIDs ) {
                    for ( const dayTemplate of dayTemplateItems ) {
                        if ( dayTemplate.genderType ) {
                            if ( !sportSite.genderTypes.includes( dayTemplate.genderType ) ) {
                                return this.errorUtil.throwClientError( "چنین جنسیتی برای این سایت ورزشی وجود ندارد", 400 );
                            }
                        }
                        const sportSiteSession = await this.models.Session.create( {
                            "date": startDate,
                            "isDynamic": template.constants ? template.constants.isDynamic || false : false,
                            "isMultiUse": template.constants ? template.constants.isMultiUse || false : false,
                            "validDateRangeInDay": template.constants ? template.constants.validDateRangeInDay || null : null,
                            "capacity": dayTemplate.capacity,
                            "price": dayTemplate.price,
                            "discountPrecent": dayTemplate.discountPrecent,
                            "discountExpireDate": dayTemplate.discountExpireDate,
                            "genderType": "مرد",
                            "sportType": dayTemplate.sportSite,
                            "adultType": dayTemplate.adultType,
                            "qualityType": dayTemplate.qualityType,
                            "information": dayTemplate.information,
                            "sessionTimeUUID": sportSiteSessionTimeUUID
                        } );

                        await this.resourceAuthorizeUtil.addResourcePolicy( sportSite.userUUID, sportSiteSession.uuid, "all" );
                    }
                }
            }
            
            startDate.setDate( startDate.getDate() + 1 );
        }
        await this.models.Session.bulkCreate( sportSiteSessions );
    }
}

module.exports = Logics;
