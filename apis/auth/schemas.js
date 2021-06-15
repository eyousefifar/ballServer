const userObjForSignupByEmailSchema = {
        "type": "object",
        "required": [ "name", "email", "password" ],
        "properties": {
            "name": { "type": "string" },
            "email": { "type": "string", "format": "email" },
            "password": { "type": "string", "minimum": 6 }
        }
    },
    userObjForSignupByPhoneSchema = {
        "type": "object",
        "required": [ "name" ],
        "properties": {
            "name": { "type": "string" }
        }
    };

module.exports = {
    "userForGetAccessTokenSchema": {
        "body": {
            "type": "object",
            "required": [ "refreshToken" ],
            "properties": {
                "refreshToken": { "type": "string" },
                "email": { "type": "string", "format": "email" },
                "phone": { "type": "string" },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "customerForSignupByEmailSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj" ],
            "properties": {
                "userObj": userObjForSignupByEmailSchema,
                "customerObj": {
                    "type": "object",
                    "required": [ "bodyInfo" ],
                    "properties": {
                        "bodyInfo": { "type": "object" }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "providerForSignupByEmailSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj", "providerObj" ],
            "properties": {
                "userObj": userObjForSignupByEmailSchema,
                "providerObj": {
                    "type": "object",
                    "required": [ "isin", "fatherName", "homeTelphone" ],
                    "properties": {
                        "isin": {
                            "type": "string"
                        },
                        "fatherName": {
                            "type": "string"
                        },
                        "homeTelphone": {
                            "type": "string"
                        }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "providerAssistantForSignupByEmailSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj", "providerAssistantObj" ],
            "properties": {
                "userObj": userObjForSignupByEmailSchema,
                "providerAssistantObj": {
                    "type": "object",
                    "required": [ "businessOwnerUUID" ],
                    "properties": {
                        "businessOwnerUUID": { "type": "number", "minimum": 1 }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "customerForSignupByPhoneSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj", "phoneConfirmKey" ],
            "properties": {
                "phoneConfirmKey": { "type": "string" },
                "userObj": userObjForSignupByPhoneSchema,
                "customerObj": {
                    "type": "object",
                    "required": [ "bodyInfo" ],
                    "properties": {
                        "bodyInfo": { "type": "object" }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "providerForSignupByPhoneSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj", "providerObj", "phoneConfirmKey" ],
            "properties": {
                "phoneConfirmKey": { "type": "string" },
                "userObj": userObjForSignupByPhoneSchema,
                "providerObj": {
                    "type": "object",
                    "required": [ "isin", "fatherName", "homeTelphone" ],
                    "properties": {
                        "isin": {
                            "type": "string"
                        },
                        "fatherName": {
                            "type": "string"
                        },
                        "homeTelphone": {
                            "type": "string"
                        }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "providerAssistantForSignupByPhoneSchema": {
        "body": {
            "type": "object",
            "required": [ "userObj", "providerAssistantObj", "phoneConfirmKey" ],
            "properties": {
                "phoneConfirmKey": { "type": "string" },
                "userObj": userObjForSignupByPhoneSchema,
                "providerAssistantObj": {
                    "type": "object",
                    "required": [ "businessOwnerUUID" ],
                    "properties": {
                        "businessOwnerUUID": { "type": "number", "minimum": 1 }
                    }
                },
                "deviceToken": { "type": "string" }
            }
        }
    },
    "userForLoginByEmailSchema": {
        "body": {
            "type": "object",
            "required": [ "email", "password" ],
            "properties": {
                "email": { "type": "string", "format": "email" },
                "password": { "type": "string", "minimum": 6 },
                "deviceToken": {
                    "type": "string"
                }
            }
        }
    },
    "userForLoginByPhoneSchema": {
        "body": {
            "type": "object",
            "required": [ "key", "phone" ],
            "properties": {
                "key": { "type": "string" },
                "phone": { "type": "string" },
                "deviceToken": {
                    "type": "string"
                }
            }
        }
    },
    "userForLoginByPhoneRequestSchema": {
        "body": {
            "type": "object",
            "required": [ "phone" ],
            "properties": {
                "phone": { "type": "string" }
            }
        }
    },
    "userForVerifyEmailRequestSchema": {
        "body": {
            "type": "object",
            "required": [ "email" ],
            "properties": {
                "email": { "type": "string", "format": "email" }
            }
        }
    },
    "userForVerifyEmailSchema": {
        "params": {
            "type": "object",
            "required": [ "key" ],
            "properties": {
                "key": { "type": "string" }
            }
        }
    },
    "userForVerifyPhoneRequestSchema": {
        "body": {
            "type": "object",
            "required": [ "phone" ],
            "properties": {
                "phone": { "type": "string" }
            }
        }
    },
    "userForVerifyPhoneSchema": {
        "body": {
            "type": "object",
            "required": [ "key", "phone" ],
            "properties": {
                "key": { "type": "string" },
                "phone": { "type": "string" }
            }
        }
    },
    "userForResetPasswordRequestSchema": {
        "body": {
            "type": "object",
            "required": [ "email" ],
            "properties": {
                "email": { "type": "string", "format": "email" }
            }
        }
    },
    "userForResetPasswordSchema": {
        "body": {
            "type": "object",
            "required": [ "token", "password" ],
            "properties": {
                "token": { "type": "string" },
                "password": { "type": "string" }
            }
        }
    },
    "userForCheckExistSchema": {
        "body": {
            "oneOf": [
                {
                    "type": "object",
                    "required": [ "email" ],
                    "properties": {
                        "email": { "type": "string", "format": "email" }
                    }
                },
                {
                    "type": "object",
                    "required": [ "phone" ],
                    "properties": {
                        "phone": { "type": "string" }
                    }
                }
            ]
        }
    }
};
