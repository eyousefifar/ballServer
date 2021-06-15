class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, userService ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.userService = userService;
    }

    async add( commentObj, { "transaction": t = null } = {} ) {
        const [ comment ] = await Promise.all( [
            this.models.Comment.create( commentObj, { "transaction": t } ),
            ( () => {
                if ( commentObj.replyCommentUUID ) {
                    return this.editById( commentObj.replyCommentUUID, { "hasRepliedComments": true }, { "transaction": t } );
                }
            } )()
        ] );

        return comment;
    }

    async editById( commentUUID, commentObj, { "transaction": t = null } = {} ) {
        const comment = await this.getById( commentUUID, { "transaction": t } );

        await comment.update( commentObj, { "transaction": t } );
    }

    async removeById( commentUUID, { "transaction": t = null } = {} ) {
        const comment = await this.getById( commentUUID, { "transaction": t } );

        await comment.destroy( { "transaction": t } );
    }

    async getById( commentUUID, { "transaction": t = null } = {} ) {
        const comment = await this.models.Comment.findByPk( commentUUID, { "transaction": t } );

        if ( !comment ) {
            return this.errorUtil.throwClientError( "چنین نظری ثبت نشده است", 404 );
        }
        return comment;
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getUser = true, userOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.ownerResourceUUID = {
                [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
            };
            if ( confirmStatus !== null ) {
                queryObj.where.confirmStatus = {
                    [ this.sequelizeObj.Op.eq ]: confirmStatus
                };
            }
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.User,
                        "as": "user",
                        ...userQueryObj
                    }
                ];
            }
        }
        return await this.models.Comment.findAll( queryObj );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getSportSite = true, sportSiteOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.userUUID = {
                [ this.sequelizeObj.Op.eq ]: userUUID
            };
            if ( confirmStatus !== null ) {
                queryObj.where.confirmStatus = {
                    [ this.sequelizeObj.Op.eq ]: confirmStatus
                };
            }
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getSportSite === true || getSportSite === "true" ) {
                const sportSiteQueryObj = sportSiteOdataStr ? this.sequelizeOdataUtil( sportSiteOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.SportSite,
                        "as": "sportSite",
                        ...sportSiteQueryObj
                    }
                ];
            }
        }
        return await this.models.Comment.findAll( queryObj );
    }

    async getAllForComment( replyCommentUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, confirmStatus = true, getUser = true, userOdataStr = null, getSportSite = true, sportSiteOdataStr = null } = {} ) {
        if ( !queryObj ) {
            queryObj = odataStr ? this.sequelizeOdataUtil( odataStr ) : {};
            queryObj.where = queryObj.where ? queryObj.where : {};
            queryObj.where.replyCommentUUID = {
                [ this.sequelizeObj.Op.eq ]: replyCommentUUID
            };
            if ( confirmStatus !== null ) {
                queryObj.where.confirmStatus = {
                    [ this.sequelizeObj.Op.eq ]: confirmStatus
                };
            }
            if ( pageNumber && pageSize ) {
                queryObj.offset = ( pageNumber - 1 ) * pageSize;
                queryObj.limit = pageSize;
            }
            if ( getUser === true || getUser === "true" ) {
                const userQueryObj = userOdataStr ? this.sequelizeOdataUtil( userOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.User,
                        "as": "user",
                        ...userQueryObj
                    }
                ];
            }
            if ( getSportSite === true || getSportSite === "true" ) {
                const sportSiteQueryObj = sportSiteOdataStr ? this.sequelizeOdataUtil( sportSiteOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.SportSite,
                        "as": "sportSite",
                        ...sportSiteQueryObj
                    }
                ];
            }
        }
        return await this.models.Comment.findAll( queryObj );
    }
}

module.exports = Logics;
