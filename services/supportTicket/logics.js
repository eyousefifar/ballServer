class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil, sequelizeOdataUtil, resourceAuthorizeUtil, service ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.sequelizeOdataUtil = sequelizeOdataUtil;
        this.errorUtil = errorUtil;
        this.resourceAuthorizeUtil = resourceAuthorizeUtil;
        this.service = service;
    }

    async add( supportTicketObj ) {
        const supportTicket = await this.models.SupportTicket.create( supportTicketObj );

        return supportTicket;
    }

    async editById( supportTicketUUID, supportTicketObj, { "transaction": t } = { "transaction": null } ) {
        const supportTicket = await this.getById( supportTicketUUID, { "transaction": t } );

        supportTicket.update( supportTicketObj, { "transaction": t } );
    }

    async getById( supportTicketUUID, { "transaction": t } = { "transaction": null } ) {
        const supportTicket = await this.models.SupportTicket.findByPk( supportTicketUUID, { "transaction": t } );

        if ( !supportTicket ) {
            return this.errorUtil.throwClientError( "چنین تیکتی ثبت نشده است", 404 );
        }
        return supportTicket;
    }

    async checkExistById( supportTicketUUID ) {
        const supportTicket = await this.models.SupportTicket.count( {
            "where": {
                "uuid": {
                    [ this.sequelizeObj.Op.eq ]: supportTicketUUID
                }
            }
        } );

        return !!supportTicket;
    }

    async getAllForOwnerResource( ownerResourceUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getComment = false, commentOdataStr = null } = {} ) {
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
            if ( getComment === true || getComment === "true" ) {
                const commentQueryObj = commentOdataStr ? this.sequelizeOdataUtil( commentOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.Comment,
                        "as": "supportTicketCommets",
                        ...commentQueryObj
                    }
                ];
            }
        }
        return await this.models.SupportTicket.findAll( queryObj );
    }

    async getAllForOwnerUser( userUUID, { pageNumber = null, pageSize = null, odataStr = null, queryObj = null, getSportSite = true, sportSiteOdataStr = null, getSportSiteAddress = true, sportSiteAddressOdataStr = null, getComment = false, commentOdataStr = null } = {} ) {
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
            if ( getComment === true || getComment === "true" ) {
                const commentQueryObj = commentOdataStr ? this.sequelizeOdataUtil( commentOdataStr ) : {};

                queryObj.include = [
                    {
                        "model": this.models.Comment,
                        "as": "supportTicketCommets",
                        ...commentQueryObj
                    }
                ];
            }
        }
        return await this.models.SupportTicket.findAll( queryObj );
    }
}

module.exports = Logics;
