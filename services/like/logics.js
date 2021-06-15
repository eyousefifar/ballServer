class Logics {
    constructor( { models, sequelizeObj, sequelizeDbObj }, redisDbClient, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil ) {
        this.models = models;
        this.sequelizeDbObj = sequelizeDbObj;
        this.sequelizeObj = sequelizeObj;
        this.redisDbClient = redisDbClient;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
    }

    async add( likeObj, { "transaction": t = null } = {} ) {
        return await this.models.Like.create( likeObj, { "transaction": t } );
    }

    async editById( likeUUID, likeObj, { "transaction": t = null } = {} ) {
        const like = await this.getById( likeUUID, { "transaction": t } );

        await like.update( likeObj, { "transaction": t } );
    }

    async removeById( likeUUID, { "transaction": t = null } = {} ) {
        const like = await this.getById( likeUUID, { "transaction": t } );

        await like.destroy( { "transaction": t } );
    }

    async getById( likeUUID, { "transaction": t = null } = {} ) {
        const like = await this.models.Like.findByPk( likeUUID, { "transaction": t } );

        if ( !like ) {
            return this.errorUtil.throwClientError( "چنین لایک ای ثبت نشده است", 404 );
        }
        return like;
    }

    async getForOwnerResourceAndOwnerUser( userUUID, ownerResourceUUID, { "transaction": t = null } = {} ) {
        const like = await this.models.Like.findOne( {
            "where": {
                "ownerResourceUUID": {
                    [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                },
                "userUUID": {
                    [ this.sequelizeObj.Op.eq ]: userUUID
                }
            }
        }, { "transaction": t } );

        if ( !like ) {
            return this.errorUtil.throwClientError( "چنین لایک ای ثبت نشده است", 404 );
        }
        return like;
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getUser = true } = {} ) {
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
            if ( getUser === true || getUser === "true" ) {
                queryObj.include = [
                    {
                        "model": this.models.User,
                        "as": "user"
                    }
                ];
            }
        }
        return await this.models.Like.findAll( queryObj );
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
            if ( getSportSite === true || getSportSite === "true" ) {
                const sportSiteQueryObj = sportSiteOdataStr ? this.sequelizeOdataUtil( sportSiteOdataStr ) : {};

                if ( getSportSiteAddress === true || getSportSiteAddress === "true" ) {
                    const sportSiteAddressQueryObj = sportSiteAddressOdataStr ? this.sequelizeOdataUtil( sportSiteAddressOdataStr ) : {};

                    sportSiteQueryObj.include = [
                        {
                            "model": this.models.Address,
                            "as": "address",
                            ...sportSiteAddressQueryObj
                        }
                    ];
                }
                queryObj.include = [
                    {
                        "model": this.models.SportSite,
                        "as": "sportSite",
                        ...sportSiteQueryObj
                    }
                ];
            }
        }
        return await this.models.Like.findAll( queryObj );
    }

    async countAllForOwnerResource( ownerResourceUUID ) {
        return await this.models.Like.count( { "where": { "ownerResourceUUID": ownerResourceUUID } } );
    }
}

module.exports = Logics;
