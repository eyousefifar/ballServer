const _ = require( "lodash" ),
    moment = require( "moment" ),
    clone = require( "clone" ),
    qs = require( "qs" );

class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, sportSiteService, banerService ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.sportSiteService = sportSiteService;
        this.banerService = banerService;
        this.errorUtil = errorUtil;
    }

    async get( { pageNumber = null, pageSize = null, sportSiteOdataStr = null, bannerOdataStr = null } = {} ) {
        const nowDate = new Date();
        const nowDateStr = moment( nowDate ).format( "YYYY-MM-DD HH:mm:ss +03:30" );
        let sportSiteQueryObj;
        let bannerQueryObj;

        sportSiteQueryObj = sportSiteOdataStr ? this.sequelizeOdataUtil( sportSiteOdataStr ) : {};
        sportSiteQueryObj.where = sportSiteQueryObj.where ? sportSiteQueryObj.where : {};
        sportSiteQueryObj.attributes = [ "uuid", "name", "type", "sportTypes", "rateAvg", "mainPicUrl", "minPrice", "maxDiscountPrecent", "maxDiscountExpireDate" ];
        sportSiteQueryObj.include = [
            {
                "model": this.models.Address,
                "as": "address",
                "attributes": [ "area" ]
            }
        ];
        if ( pageNumber && pageSize ) {
            sportSiteQueryObj.offset = ( pageNumber - 1 ) * pageSize;
            sportSiteQueryObj.limit = pageSize;
        }
        let bestSportSitesByRateAvgQueryObj = clone( sportSiteQueryObj );
        let bestSportSitesByDiscountPrecentQueryObj = clone( sportSiteQueryObj );

        bestSportSitesByRateAvgQueryObj.order = [ [ "rateAvg", "DESC" ] ];
        bestSportSitesByRateAvgQueryObj.attributes.push( [ this.sequelizeDbObj.literal( `"maxDiscountExpireDate" > '${nowDateStr}'` ), "isValidDiscount" ] );
        bestSportSitesByDiscountPrecentQueryObj.order = [ [ "maxDiscountPrecent", "DESC" ] ];
        bestSportSitesByDiscountPrecentQueryObj.where.maxDiscountExpireDate = {
            [ this.sequelizeObj.Op.gt ]: nowDate
        };
        bannerQueryObj = bannerOdataStr ? this.sequelizeOdataUtil( bannerOdataStr ) : {};
        bannerQueryObj.where = bannerQueryObj.where ? bannerQueryObj.where : {};
        bannerQueryObj.include = [
            {
                "model": this.models.Media,
                "as": "media"
            }
        ];
        if ( pageNumber && pageSize ) {
            bannerQueryObj.offset = ( pageNumber - 1 ) * pageSize;
            bannerQueryObj.limit = pageSize;
        }
        const [ bestSportSitesByRateAvg, bestSportSitesByDiscountPrecent, baners ] = await Promise.all( [
            this.sportSiteService.getAll( { "queryObj": bestSportSitesByRateAvgQueryObj } ),
            this.sportSiteService.getAll( { "queryObj": bestSportSitesByDiscountPrecentQueryObj } ),
            this.banerService.getAll( { "queryObj": bannerQueryObj } )
        ] );
        let sportSites = _( bestSportSitesByRateAvg )
            .groupBy( "type" )
            .map( ( sportSite, key ) => ( {
                "title": `${key}های نمونه`,
                "odataStr": qs.stringify( { "odataStr": `$filter=type eq '${key}'&$orderby=rateAvg desc` } ),
                "odataWithSearchRaw": `$filter=substringof('key',name) and type eq '${key}'&$orderby=rateAvg desc`,
                "data": sportSite
            } ) ).value();
        sportSites.push( {
            "title": "بیشترین تخفیف دارها",
            "odataStr": qs.stringify( { "odataStr": `$filter=maxDiscountExpireDate gt '${nowDate}'&$orderby=maxDiscountPrecent desc` } ),
            "odataWithSearchRaw": `$filter=substringof('key',name) and maxDiscountExpireDate gt '${nowDate}'&$orderby=maxDiscountPrecent desc`,
            "data": bestSportSitesByDiscountPrecent
        } );

        return { "sportSites": sportSites, "baners": baners };
    }
}

module.exports = Logics;
