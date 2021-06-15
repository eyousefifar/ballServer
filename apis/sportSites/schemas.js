const { sportSiteTypes, sportTypes, genderTypes } = require( "../../services/sportSite/configs" ).constants;
const cityNames = [
    "قم"
];
const { "maxPageSize": sportSiteMaxPage } = require( "../../services/sportSite/configs" ).constants.pagination,
    { "maxPageSize": sportSiteMediaMaxPage } = require( "../../services/sportSite/services/media/configs" ).constants.pagination,
    { "maxPageSize": sportSiteWorkPlanMaxPage } = require( "../../services/sportSite/services/workPlan/configs" ).constants.pagination,
    { "maxPageSize": sportSiteHdateMaxPage } = require( "../../services/sportSite/services/hdate/configs" ).constants.pagination,
    { "maxPageSize": sportSiteRateMaxPage } = require( "../../services/sportSite/services/rate/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSessionMaxPage } = require( "../../services/sportSite/services/session/configs" ).constants.pagination,
    { "maxPageSize": sportSiteLikeMaxPage } = require( "../../services/sportSite/services/like/configs" ).constants.pagination,
    { "maxPageSize": sportSiteSupportTicketMaxPage } = require( "../../services/sportSite/services/supportTicket/configs" ).constants.pagination;

module.exports = {
    "sportSiteForAddSchema": {
        "body": {
            "type": "object",
            "required": [ "name", "tel", "description", "playgroundInformation", "type", "sportTypes", "genderTypes", "addressObj" ],
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 5
                },
                "tel": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "description": {
                    "type": "string",
                    "minLength": 5
                },
                "playgroundInformation": {
                    "type": "object"
                },
                "type": {
                    "enum": [ ...sportSiteTypes ]
                },
                "sportTypes": {
                    "type": "array",
                    "items": {
                        "enum": [ ...sportTypes ]
                    }
                },
                "genderTypes": {
                    "type": "array",
                    "items": {
                        "enum": [ ...genderTypes ]
                    }
                },
                "addressObj": {
                    "type": "object",
                    "required": [ "city", "area", "descriptiveAddress", "coordinateAddress", "postalCode" ],
                    "properties": {
                        "city": {
                            "enum": [ ...cityNames ]
                        },
                        "area": {
                            "type": "string"
                        },
                        "descriptiveAddress": {
                            "type": "string"
                        },
                        "coordinateAddress": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "postalCode": {
                            "type": "string"
                        }
                    }
                },
                "sportSiteComplexUUID": {
                    "type": "string",
                    "format": "uuid"
                }
            }
        }
    },
    "sportSiteForEditSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "body": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 5
                },
                "tel": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "description": {
                    "type": "string"
                },
                "playgroundInformation": {
                    "type": "object"
                },
                "sportTypes": {
                    "type": "array",
                    "items": {
                        "enum": [ ...sportTypes ]
                    }
                },
                "genderTypes": {
                    "type": "array",
                    "items": {
                        "enum": [ ...genderTypes ]
                    }
                },
                "addressObj": {
                    "type": "object",
                    "required": [ "city", "area", "descriptiveAddress", "coordinateAddress", "postalCode" ],
                    "properties": {
                        "city": {
                            "enum": [ ...cityNames ]
                        },
                        "area": {
                            "type": "string"
                        },
                        "descriptiveAddress": {
                            "type": "string"
                        },
                        "coordinateAddress": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        },
                        "postalCode": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "sportSiteForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteForGetAllSchema": {
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteHdateForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteHdateMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteMediaForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteMediaMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteLikeForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSite_sportSiteReserveForCheckSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSite_sportSiteLikeForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteLikeMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteLikeForCountSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSite_sportSiteSupportTicketForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteSupportTicketMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteWorkPlanForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteWorkPlanMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteSessionForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteSessionMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteReserveItemCardForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSite_sportSiteRateForGetAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        },
        "query": {
            "type": "object",
            "properties": {
                "pageSize": { "type": "integer", "maximum": sportSiteRateMaxPage },
                "pageNumber": { "type": "integer" }
            }
        }
    },
    "sportSite_sportSiteRateForAverageAllSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },

    "sportSite_sportSiteWalletForGetSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    },
    "sportSiteForGetPageSchema": {
        "params": {
            "type": "object",
            "required": [ "sportSiteUUID" ],
            "properties": {
                "sportSiteUUID": { "type": "string", "format": "uuid" }
            }
        }
    }
};
