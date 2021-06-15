class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( rateObj, { "transaction": t = null } = {} ) {
        return await this.models.Rate.create( rateObj, { "transaction": t } );
    }

    async editById( rateUUID, rateObj, { "transaction": t = null } = {} ) {
        const rate = await this.getById( rateUUID, { "transaction": t } );

        await rate.update( rateObj, { "transaction": t } );
    }

    async getById( rateUUID, { "transaction": t = null } = {} ) {
        const rate = await this.models.Rate.findByPk( rateUUID, { "transaction": t } );

        if ( !rate ) {
            return this.errorUtil.throwClientError( "چنین امتیاز دهی ای ثبت نشده است", 404 );
        }
        return rate;
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getUser = true, userOdataStr = null, getComment = true, commentOdataStr = null, getItem = false, itemOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.ownerResourceUUID = {
                [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
            };
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            queryObj.include = [];
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include.push( {
                    "model": this.models.User,
                    "as": "user",
                    "required": true,
                    ...userQueryObj
                } );
            }
            if ( getComment === true || getComment === "true" ) {
                const commentQueryObj = commentOdataStr ? this.sequelizeOdataUtil( commentOdataStr ) : {};

                commentQueryObj.where = commentQueryObj.where ? commentQueryObj.where : {};
                commentQueryObj.where.confirmStatus = {
                    [ this.sequelizeObj.Op.eq ]: true
                };
                queryObj.include.push( {
                    "model": this.models.Comment,
                    "as": "comment",
                    "required": true,
                    ...commentQueryObj
                } );
            }
            if ( getItem === true || getItem === "true" ) {
                const itemQueryObj = itemOdataStr ? this.sequelizeOdataUtil( itemOdataStr ) : {};

                queryObj.include.push( {
                    "model": this.models.RateItem,
                    "as": "rateItems",
                    "required": true,
                    ...itemQueryObj
                } );
            }
        }
        
        return await this.models.Rate.findAll( queryObj );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getUser = true, userOdataStr = null, getComment = true, commentOdataStr = null, getItem = false, itemOdataStr = null } = {} ) {
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
            queryObj.include = [];
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include.push( {
                    "model": this.models.User,
                    "as": "user",
                    "required": true,
                    ...userQueryObj
                } );
            }
            if ( getComment === true || getComment === "true" ) {
                const commentQueryObj = commentOdataStr ? this.sequelizeOdataUtil( commentOdataStr ) : {};

                commentQueryObj.where = commentQueryObj.where ? commentQueryObj.where : {};
                commentQueryObj.where.confirmStatus = {
                    [ this.sequelizeObj.Op.eq ]: true
                };
                queryObj.include.push( {
                    "model": this.models.Comment,
                    "as": "comment",
                    "required": true,
                    ...commentQueryObj
                } );
            }
            if ( getItem === true || getItem === "true" ) {
                const itemQueryObj = itemOdataStr ? this.sequelizeOdataUtil( itemOdataStr ) : {};

                queryObj.include.push( {
                    "model": this.models.RateItem,
                    "as": "rateItems",
                    "required": true,
                    ...itemQueryObj
                } );
            }
        }
        return await this.models.Rate.findAll( queryObj );
    }
    
    async getForOwnerResourceAndOwnerUser( userUUID, ownerResourceUUID, { getUser = true, userOdataStr = null, getComment = true, commentOdataStr = null, getItem = false, itemOdataStr = null } = {} ) {
        let queryObj = {};
        queryObj.where = {};
        queryObj.where.userUUID = {
            [ this.sequelizeObj.Op.eq ]: userUUID
        };
        queryObj.where.ownerResourceUUID = {
            [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
        };
        queryObj.include = [];
        if ( getUser === true || getUser === "true" ) {
            const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

            queryObj.include.push( {
                "model": this.models.User,
                "as": "user",
                "required": true,
                ...userQueryObj
            } );
        }
        if ( getComment === true || getComment === "true" ) {
            const commentQueryObj = commentOdataStr ? this.sequelizeOdataUtil( commentOdataStr ) : {};

            commentQueryObj.where = commentQueryObj.where ? commentQueryObj.where : {};
            commentQueryObj.where.confirmStatus = {
                [ this.sequelizeObj.Op.eq ]: true
            };
            queryObj.include.push( {
                "model": this.models.Comment,
                "as": "comment",
                "required": true,
                ...commentQueryObj
            } );
        }
        if ( getItem === true || getItem === "true" ) {
            const itemQueryObj = itemOdataStr ? this.sequelizeOdataUtil( itemOdataStr ) : {};

            queryObj.include.push( {
                "model": this.models.RateItem,
                "as": "rateItems",
                "required": true,
                ...itemQueryObj
            } );
        }
        return await this.models.Rate.findOne( queryObj );
    }

    async checkExistForOwnerResourceAndOwnerUser( userUUID, ownerResourceUUID ) {
        const sportSiteRate = await this.models.Rate.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    {
                        "ownerResourceUUID": {
                            [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                        }
                    }
                ]
            }
        } );

        return !!sportSiteRate;
    }

    async averageAllForOwnerResource( ownerResourceUUID ) {
        return this.models.Rate.findAll( {
            "attributes": [
                [
                    this.sequelizeDbObj.fn( "AVG", this.sequelizeDbObj.col( "rate" ) ),
                    "rateAVG"
                ]
            ],
            "where": {
                "ownerResourceUUID": {
                    [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                }
            }
        } );
    }

    async averageAllByItemNameGroupForOwnerResource( ownerResourceUUID ) {
        return await this.sequelizeDbObj.query( `SELECT "RateItem"."itemName" as "itemName", avg("RateItem"."rateAmount") AS "itemNameAvg"
             FROM "Rate" INNER JOIN "RateItem" ON "Rate"."uuid" = "RateItem"."rateUUID" WHERE "Rate"."ownerResourceUUID" = ? GROUP BY 
             "RateItem"."itemName";`,
        { "replacements": [ ownerResourceUUID ], "type": this.sequelizeDbObj.QueryTypes.SELECT } );
    }
}

module.exports = Logics;
