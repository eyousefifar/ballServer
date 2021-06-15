const moment = require( "moment" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, walletService, addressService, rateService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.errorUtil = errorUtil;
        this.walletService = walletService;
        this.addressService = addressService;
        this.rateService = rateService;
    }

    async add( userUUID, sportSiteObj ) {
        sportSiteObj.userUUID = userUUID;
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            const sportSiteAddress = await this.addressService.add( sportSiteObj.addressObj, { "transaction": t } );

            sportSiteObj.addressUUID = sportSiteAddress.uuid;
            const sportSite = await this.sequelizeCachingUtil.withCache( this.models.SportSite ).cache().create( sportSiteObj, { "transaction": t } );
            const sportSiteWallet = await this.walletService.add( {
                "ownerResourceUUID": sportSite.uuid,
                "ownerResourceType": "SportSite"
            }, { "transaction": t } );

            await Promise.all( [
                this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSite.uuid, "all" ),
                this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteAddress.uuid, "all" ),
                this.resourceAuthorizeUtil.addResourcePolicy( userUUID, sportSiteWallet.uuid, "all" )
            ] );
            sportSite.dataValues.address = sportSiteAddress;
            sportSite.dataValues.wallet = sportSiteWallet;
            return sportSite;
        } );
    }

    async editById( sportSiteUUID, sportSiteObj ) {
        const sportSite = await this.getById( sportSiteUUID, { "getAddress": false } );

        if ( sportSiteObj.sportTypes ) {
            sportSiteObj.enableStatus = false;
        }
        if ( sportSiteObj.genderTypes ) {
            sportSiteObj.enableStatus = false;
        }
        if ( sportSiteObj.tel ) {
            sportSiteObj.enableStatus = false;
        }
        if ( sportSiteObj.address ) {
            sportSiteObj.enableStatus = false;
        }
        return this.sequelizeDbObj.transaction( {
            "isolationLevel": this.sequelizeObj.Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async( t ) => {
            if ( sportSiteObj.addressObj ) {
                this.addressService.editById( sportSite.addressUUID, sportSiteObj.addressObj, { "transaction": t } );
            }
            sportSite.cache().update( sportSiteObj, { "transaction": t } );
        } );
    }

    async getById( sportSiteUUID, { "transaction": t } = { "transaction": null } ) {
        const sportSite = await this.sequelizeCachingUtil.withCache( this.models.SportSite ).cache().findByPk( sportSiteUUID, { "transaction": t } );
        
        if ( !sportSite ) {
            return this.errorUtil.throwClientError( "چنین سایت ورزشی ثبت نشده است", 404 );
        }
        return sportSite;
    }

    async getAll( { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getAddress = true } = {} ) {
        if ( !queryObj ) {
            const nowDate = moment( new Date() ).format( "YYYY-MM-DD HH:mm:ss +03:30" );

            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.enableStatus = {
                [ this.sequelizeObj.Op.eq ]: true
            };
            queryObj.attributes = queryObj.attributes ? queryObj.attributes : {};
            queryObj.attributes.include = [ [ this.sequelizeDbObj.literal( `"maxDiscountExpireDate" > '${nowDate}'` ), "isValidDiscount" ] ];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getAddress === true || getAddress === "true" ) {
                queryObj.include = [ {
                    "model": this.models.Address,
                    "as": "address"
                } ];
            }
        }
        return await this.models.SportSite.findAll( queryObj );
    }

    async getAllForUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getAddress = true } = {} ) {
        if ( !queryObj ) {
            const nowDate = moment( new Date() ).format( "YYYY-MM-DD HH:mm:ss +03:30" );

            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            queryObj.attributes = queryObj.attributes ? queryObj.attributes : {};
            queryObj.attributes.include = [ [ this.sequelizeDbObj.literal( `"maxDiscountExpireDate" > '${nowDate}'` ), "isValidDiscount" ] ];
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getAddress === true || getAddress === "true" ) {
                queryObj.include = [ {
                    "model": this.models.Address,
                    "as": "address"
                } ];
            }
        }
        return await this.models.SportSite.findAll( queryObj );
    }

    async getPage( sportSiteUUID, { odataStr = null, queryObj = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.uuid = {
                [ this.sequelizeObj.Op.eq ]: sportSiteUUID
            };
            queryObj.include = [
                {
                    "model": this.models.Media,
                    "as": "medias"
                },
                {
                    "model": this.models.WorkPlan,
                    "as": "workPlans"
                },
                {
                    "model": this.models.Address,
                    "as": "address"
                }
            ];
        }
        const [ sportSiteGroupedRateItemsByItemName, sportSitePage ] = await Promise.all( [
            this.rateService.averageAllByItemNameGroupForOwnerResource( sportSiteUUID ),
            this.models.SportSite.findOne( queryObj )
        ] );

        sportSitePage.dataValues.rateItems = sportSiteGroupedRateItemsByItemName;
        return sportSitePage;
    }

    async checkExistById( sportSiteUUID ) {
        const sportSite = await this.models.SportSite.count( {
            "where": {
                "uuid": {
                    [ this.sequelizeObj.Op.eq ]: sportSiteUUID
                }
            }
        } );

        return !!sportSite;
    }

    async validateSportSiteSportTypes( sportSiteType, _sportTypes ) {
        const sportTypes = await this.sequelizeCachingUtil.withCache( this.models.SportSiteType ).cache( `sportSiteType_${sportSiteType}_sportTypes` ).findOne( {
            "where": {
                "name": {
                    [ this.sequelizeObj.eq ]: sportSiteType
                }
            },
            "include": [
                {
                    "model": this.models.SportType,
                    "as": "sportTypes"
                }
            ]
        } ).sportTypes;

        for ( const _sportType of _sportTypes ) {
            if ( !sportTypes.include( _sportType ) ) {
                return this.errorUtil.throwClientError( "امکان اضافه کردن این ورزش در این سایت ورزشی وجود ندارد", 400 );
            }
        }
    }
}

module.exports = Logics;
