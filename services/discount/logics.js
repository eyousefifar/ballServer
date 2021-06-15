class Logics {
    constructor( { models, sequelizeObj }, errorUtil, sequelizeCachingUtil ) {
        this.models = models;
        this.sequelizeObj = sequelizeObj;
        this.sequelizeCachingUtil = sequelizeCachingUtil;
        this.errorUtil = errorUtil;
    }

    async addPublic( publicDiscountObj, { "transaction": t = null } = {} ) {
        return await this.models.DiscountPublic.create( publicDiscountObj, { "transaction": t } );
    }

    async addPrivate( privateDiscountObj, { "transaction": t = null } = {} ) {
        return await this.sequelizeCachingUtil.withCache( this.models.DiscountPrivate ).cache().create( privateDiscountObj, { "transaction": t } );
    }

    async editPublicById( publicDiscountUUID, publicDiscountObj, { "transaction": t = null } = {} ) {
        const publicDiscount = await this.getPublicById( publicDiscountUUID, { "transaction": t } );

        await publicDiscount.update( publicDiscountObj, { "transaction": t } );
    }

    async editPrivateById( discountPrivateUUID, privateDiscountObj, { "transaction": t = null } = {} ) {
        const privateDiscount = await this.getPrivateById( discountPrivateUUID, { "transaction": t } );

        await privateDiscount.cache().update( privateDiscountObj, { "transaction": t } );
    }

    async removePublicById( publicDiscountUUID, { "transaction": t = null } = {} ) {
        const publicDiscount = await this.getPublicById( publicDiscountUUID, { "transaction": t } );

        await publicDiscount.destroy( { "transaction": t } );
    }

    async removePrivateById( discountPrivateUUID, { "transaction": t = null } = {} ) {
        const privateDiscount = await this.getPrivateById( discountPrivateUUID, { "transaction": t } );

        await privateDiscount.cache().destroy( { "transaction": t } );
    }

    async getPublicById( publicDiscountUUID, { "transaction": t = null } = {} ) {
        const publicDiscount = await this.models.DiscountPublic.findByPk( publicDiscountUUID, { "transaction": t } );

        if ( !publicDiscount ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی ثبت نشده است", 404 );
        }
        return publicDiscount;
    }

    async getPrivateById( discountPrivateUUID, { "transaction": t = null } = {} ) {
        const privateDiscount = await this.sequelizeCachingUtil.withCache( this.models.DiscountPrivate ).cache().findByPk( discountPrivateUUID, { "transaction": t } );

        if ( !privateDiscount ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی ثبت نشده است", 404 );
        }
        return privateDiscount;
    }

    async getPrivateByCode( privateDiscountCode, { "transaction": t = null } = {} ) {
        const privateDiscount = await this.sequelizeCachingUtil.withCache( this.models.DiscountPrivate ).cache( `private_discount_code_${privateDiscountCode}` ).findOne( {
            "where": {
                "code": {
                    [ this.sequelizeObj.Op.eq ]: privateDiscountCode
                }
            }
        }, { "transaction": t } );

        if ( !privateDiscount ) {
            return this.errorUtil.throwClientError( "چنین تخفیفی ثبت نشده است", 404 );
        }
        return privateDiscount;
    }

    async getNotExpirePublicForOwnerResource( ownerResourceUUID, date ) {
        const discount = await this.models.DiscountPublic.findOne( {
            "where": {
                "ownerResourceUUID": {
                    [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                },
                "expireDate": {
                    [ this.sequelizeObj.Op.gte ]: date
                }
            }
        } );

        return discount;
    }

    async checkExistNotExpirePublicForOwnerResource( ownerResourceUUID, expireDate ) {
        const discount = await this.models.DiscountPublic.count( {
            "where": {
                "ownerResourceUUID": {
                    [ this.sequelizeObj.Op.eq ]: ownerResourceUUID
                },
                "expireDate": {
                    [ this.sequelizeObj.Op.gte ]: expireDate
                }
            }
        } );

        return !!discount;
    }

    async validatePrivate( privateDiscount ) {
        const privateDiscountExpireDate = new Date( privateDiscount.expireDate );
        const privateDiscountCapacity = privateDiscount.capacity;
        const nowDate = new Date();

        if ( privateDiscountExpireDate < nowDate ) {
            return this.errorUtil.throwClientError( "تخفیف منقضی شده است", 404 );
        }
        if ( privateDiscountCapacity === 0 ) {
            return this.errorUtil.throwClientError( "ظرفیت تخفیف به پایان رسیده است", 404 );
        }
    }

    async usePrivateDiscount( userUUID, privateDiscount, { "transaction": t = null } = {} ) {
        await Promise.all( [
            privateDiscount.cache().update( { "capacity": privateDiscount.capacity - 1 }, { "transaction": t } ),
            this.models.UserUseDiscountPrivate.create( {
                "userUUID": userUUID,
                "discountPrivateUUID": privateDiscount.uuid,
                "useStatus": true
            }, { "transaction": t } )
        ] );
    }

    async checkUsePrivateDiscount( userUUID, discountPrivateUUID ) {
        return await this.models.UserUseDiscountPrivate.count( {
            "where": {
                [ this.sequelizeObj.Op.and ]: [
                    {
                        "userUUID": {
                            [ this.sequelizeObj.Op.eq ]: userUUID
                        }
                    },
                    {
                        "discountPrivateUUID": {
                            [ this.sequelizeObj.Op.eq ]: discountPrivateUUID
                        }
                    },
                    {
                        "useStatus": {
                            [ this.sequelizeObj.Op.eq ]: true
                        }
                    }
                ]
            }
        } ) >= 1;
    }
}

module.exports = Logics;
