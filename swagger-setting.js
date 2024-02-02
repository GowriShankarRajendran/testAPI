"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpecs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Kriya Babaji Yoga Sangam API Doc",
            version: "0.1.0",
            description: "This is a API Documentation for Kriya Babaji Yoga Sangam",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Gowri Shankar R",
                url: "https://goolge.com",
                email: "gowrishanker93@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:6201",
            },
        ],
        tags: [
            {
                name: "User",
                description: "Everything about User"
            },
            {
                name: "Gallery Category",
                description: "Everything about Gallery Category"
            },
            {
                name: "Gallery",
                description: "Everything about Gallery Images"
            },
            {
                name: "Event",
                description: "Everything about Event"
            },
            {
                name: "EBook",
                description: "Everything about EBook"
            },
            {
                name: "Location",
                description: "Everything about Location"
            }
        ],
        paths: {
            ['/user']: {
                get: {
                    tags: [
                        "User"
                    ],
                    summary: "Get all user info",
                    description: "Get all user info",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/user"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access"
                        },
                        404: {
                            description: "User not found"
                        },
                    }
                }
            },
            ['/user/detail/{userGUID}']: {
                get: {
                    tags: [
                        "User"
                    ],
                    summary: "Get single user info",
                    description: "Get single user info",
                    parameters: [
                        {
                            name: "userGUID",
                            in: "path",
                            description: "User GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/user"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access"
                        },
                        404: {
                            description: "User not found"
                        },
                    }
                }
            },
            ['/user/registration']: {
                post: {
                    tags: [
                        "User"
                    ],
                    summary: "Create new User",
                    description: "Create new User",
                    requestBody: {
                        description: "Create new User",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/registrationCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "User Created Successfully"
                        },
                        401: {
                            description: "Please enter all required fields"
                        },
                        409: {
                            description: "Enter email address already available"
                        }
                    }
                }
            },
            ['/user/validateRegistration']: {
                patch: {
                    tags: [
                        "User"
                    ],
                    summary: "Validate User Registration",
                    description: "Validate User Registration",
                    requestBody: {
                        description: "Validate User Registration",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/validateRegistrationRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "Registration Validate Successfully"
                        },
                        401: {
                            description: "Incorrect validation code entered or Please enter all required fields"
                        },
                        404: {
                            description: "Enter Email ID not available"
                        }
                    }
                }
            },
            ['/user/login']: {
                post: {
                    tags: [
                        "User"
                    ],
                    summary: "User Login",
                    description: "User Login",
                    requestBody: {
                        description: "Enter Login Credentials",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/loginRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "Login Successfully",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/loginResponse"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "Account Blocked, Please contact our team"
                        },
                        404: {
                            description: "Enter Email ID not available or Incorrect Password"
                        },
                        409: {
                            description: "Please enter all required fields"
                        }
                    }
                }
            },
            ['/user/forgotPassworkUserCheck']: {
                patch: {
                    tags: [
                        "User"
                    ],
                    summary: "Forgot Password User Check",
                    description: "User Login",
                    requestBody: {
                        description: "Enter Email ID",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/forgotPassworkUserCheckRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "Check your email and enter verfication code"
                        },
                        404: {
                            description: "Enter Email ID not available"
                        },
                        409: {
                            description: "Please enter all required fields"
                        }
                    }
                }
            },
            ['/user/forgotPassword']: {
                patch: {
                    tags: [
                        "User"
                    ],
                    summary: "Enter Verification Code & New Password",
                    description: "Enter Verification Code & New Password",
                    requestBody: {
                        description: "Enter Verification Code & New Password",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/forgotPassworkRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "Password Updated Successfully"
                        },
                        404: {
                            description: "Enter Email ID not available or Enter varification code invalid"
                        },
                        409: {
                            description: "Please enter all required fields"
                        }
                    }
                }
            },
            ['/user/userStatus/{userGUID}']: {
                patch: {
                    tags: [
                        "User"
                    ],
                    summary: "Change User Status",
                    description: "Change User Status",
                    parameters: [
                        {
                            name: "userGUID",
                            in: "path",
                            description: "User GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Change User Status",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/userStatusRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "User Status Updated Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        }
                    }
                }
            },
            ['/user/userRole/{userGUID}']: {
                patch: {
                    tags: [
                        "User"
                    ],
                    summary: "Change User Role",
                    description: "Change User Role",
                    parameters: [
                        {
                            name: "userGUID",
                            in: "path",
                            description: "User GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Change User Role",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/userRoleRequest"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "User Role Updated Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        }
                    }
                }
            },
            ['/user/refreshToken']: {
                get: {
                    tags: [
                        "User"
                    ],
                    summary: "Get user info",
                    description: "Get user info",
                    // parameters: [
                    //   {
                    //     name: "userGUID",
                    //     in: "path",
                    //     description: "User GUID values that need to be considered for filter",
                    //     required: true,
                    //     explode: true,
                    //     schema: {
                    //       type: "string",
                    //     }
                    //   }
                    // ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/loginResponse"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "Account Blocked, Please contact our team or Account Activation Incomplete or Unauthorized User"
                        }
                    }
                }
            },
            ['/user/logout']: {
                get: {
                    tags: [
                        "User"
                    ],
                    summary: "Logout user",
                    description: "Logout user",
                    // parameters: [
                    //   {
                    //     name: "userGUID",
                    //     in: "path",
                    //     description: "User GUID values that need to be considered for filter",
                    //     required: true,
                    //     explode: true,
                    //     schema: {
                    //       type: "string",
                    //     }
                    //   }
                    // ],
                    responses: {
                        200: {
                            description: "Successful operation",
                        },
                        401: {
                            description: "Unauthorized User"
                        }
                    }
                }
            },
            ['/user/loginTracker/{fromDate}/{toDate}?userGUID']: {
                get: {
                    tags: [
                        "User"
                    ],
                    summary: "User Login Tracker",
                    description: "User Login Tracker",
                    parameters: [
                        {
                            name: "userGUID",
                            in: "query",
                            description: "User GUID value that need to be considered for filter",
                            required: false,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        },
                        {
                            name: "fromDate",
                            in: "path",
                            description: "From Date value that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        },
                        {
                            name: "toDate",
                            in: "path",
                            description: "To Date value that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/loginTrackerResponse"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "Unauthorized User"
                        },
                        404: {
                            description: "Login Tracker not available applied filter"
                        }
                    }
                }
            },
            ['/galleryCategory']: {
                get: {
                    tags: [
                        "Gallery Category"
                    ],
                    summary: "Get all gallery category info",
                    description: "Get all gallery category  info",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/galleryCategoryResponse"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "Gallery Category not found"
                        },
                    }
                },
                post: {
                    tags: [
                        "Gallery Category"
                    ],
                    summary: "Create new Gallery Category",
                    description: "Create new Gallery Category",
                    requestBody: {
                        description: "Create new Gallery Category",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/galleryCategoryCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "Gallery Category Created Successfully"
                        },
                        401: {
                            description: "Please enter all required fields or You not have access or Unauthorized User"
                        },
                    }
                }
            },
            ['/galleryCategory/{galCategoryGUID}']: {
                get: {
                    tags: [
                        "Gallery Category"
                    ],
                    summary: "Get single gallery category info",
                    description: "Get single gallery category info",
                    parameters: [
                        {
                            name: "galCategoryGUID",
                            in: "path",
                            description: "Gallery Category GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/galleryCategoryDetailResponse"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "Gallery Category not found"
                        },
                    }
                },
                put: {
                    tags: [
                        "Gallery Category"
                    ],
                    summary: "Update Gallery Category",
                    description: "Update Gallery Category",
                    parameters: [
                        {
                            name: "galCategoryGUID",
                            in: "path",
                            description: "Gallery Category GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Update Gallery Category",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/galleryCategoryUpdate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "Gallery Category Updated Successfully"
                        },
                        401: {
                            description: "Please enter all required fields or You not have access or Unauthorized User"
                        },
                    }
                },
                delete: {
                    tags: [
                        "Gallery Category"
                    ],
                    summary: "Delete Gallery Category",
                    description: "Delete Gallery Category",
                    parameters: [
                        {
                            name: "galCategoryGUID",
                            in: "path",
                            description: "Gallery Category GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Gallery Category Delete Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                    }
                }
            },
            ['/gallery']: {
                get: {
                    tags: [
                        "Gallery"
                    ],
                    summary: "Get all gallery images",
                    description: "Get all gallery images",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/galleryResponse"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "Gallery image not found"
                        },
                    }
                },
                post: {
                    tags: [
                        "Gallery"
                    ],
                    summary: "Add gallery images",
                    description: "Add gallery images",
                    requestBody: {
                        description: "Add gallery images",
                        content: {
                            ['multipart/form-data']: {
                                schema: {
                                    $ref: "#/components/schemas/galleryCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "Gallery Images Uploaded Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User or Please enter all required fields"
                        },
                        404: {
                            description: "Please upload file"
                        }
                    }
                }
            },
            ['/gallery/{galleryGUID}']: {
                delete: {
                    tags: [
                        "Gallery"
                    ],
                    summary: "Delete Gallery Image",
                    description: "Delete Gallery Image",
                    parameters: [
                        {
                            name: "galleryGUID",
                            in: "path",
                            description: "Gallery GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Gallery Image Delete Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "Please enter valid gallery ID"
                        }
                    }
                }
            },
            ['/event']: {
                get: {
                    tags: [
                        "Event"
                    ],
                    summary: "Get all event info",
                    description: "Get all event info",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/eventResponse"
                                        },
                                    }
                                }
                            }
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                },
                post: {
                    tags: [
                        "Event"
                    ],
                    summary: "Create new Event",
                    description: "Create new Event",
                    requestBody: {
                        description: "Create new Event",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/eventCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        201: {
                            description: "Event Create Successfully"
                        },
                        401: {
                            description: "Please enter all required fields or You not have access or Unauthorized User"
                        },
                    }
                }
            },
            ['/event/detail']: {
                get: {
                    tags: [
                        "Event"
                    ],
                    summary: "Get all event detail info",
                    description: "Get all event detail info",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/eventDetailResponse"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "Event not found"
                        }
                    }
                }
            },
            ['/event/{eventGUID}']: {
                put: {
                    tags: [
                        "Event"
                    ],
                    summary: "Update Event",
                    description: "Update Gallery Category",
                    parameters: [
                        {
                            name: "eventGUID",
                            in: "path",
                            description: "Event GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Update Event",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/eventUpdate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "Event Updated Successfully"
                        },
                        401: {
                            description: "Please enter all required fields or You not have access or Unauthorized User"
                        },
                    }
                },
                delete: {
                    tags: [
                        "Event"
                    ],
                    summary: "Delete Event",
                    description: "Delete Event",
                    parameters: [
                        {
                            name: "eventGUID",
                            in: "path",
                            description: "Event GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Event Deleted Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        }
                    }
                }
            },
            ['/eBook']: {
                get: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Get all EBook info",
                    description: "Get all EBook info",
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/eBookResponse"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "EBook not found"
                        }
                    }
                },
                post: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Add EBook",
                    description: "Add EBook",
                    requestBody: {
                        description: "Add EBook",
                        content: {
                            ['multipart/form-data']: {
                                schema: {
                                    $ref: "#/components/schemas/eBookCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "EBook Added Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User or Please enter all required fields"
                        },
                        404: {
                            description: "Please upload file"
                        }
                    }
                }
            },
            ['/eBook/{ebookGUID}']: {
                get: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Get EBook",
                    description: "Get EBook",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/eBookView"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "EBook not available"
                        },
                    }
                },
                put: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Update EBook",
                    description: "Update EBook",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Update EBook",
                        content: {
                            ['multipart/form-data']: {
                                schema: {
                                    $ref: "#/components/schemas/eBookCreate"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "EBook Updated Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User or Please enter all required fields"
                        }
                    }
                },
                patch: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Change EBook Status",
                    description: "Change EBook Status",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    requestBody: {
                        description: "Change EBook Status",
                        content: {
                            ['application/json']: {
                                schema: {
                                    $ref: "#/components/schemas/eBookUpdateStatus"
                                }
                            }
                        },
                        required: true
                    },
                    responses: {
                        200: {
                            description: "EBook Status Updated Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User or Please enter all required fields"
                        }
                    }
                },
                delete: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Delete EBook",
                    description: "Delete EBook",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "EBook Deleted Successfully"
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "EBook image not available or Please enter valid EBook ID"
                        }
                    }
                }
            },
            ['/eBook/update/{ebookGUID}']: {
                get: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Get EBook",
                    description: "Get EBook",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        $ref: "#/components/schemas/eBookView"
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "EBook not available"
                        },
                    }
                }
            },
            ['/eBook/tracker/{ebookGUID}']: {
                get: {
                    tags: [
                        "EBook"
                    ],
                    summary: "Get EBook Tracker",
                    description: "Get EBook Tracker",
                    parameters: [
                        {
                            name: "ebookGUID",
                            in: "path",
                            description: "EBook GUID values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/eBookTracker"
                                        },
                                    }
                                }
                            }
                        },
                        401: {
                            description: "You not have access or Unauthorized User"
                        },
                        404: {
                            description: "EBook Tracker not available"
                        },
                    }
                }
            },
            ['/location/country']: {
                get: {
                    tags: [
                        "Location"
                    ],
                    summary: "Get All Country",
                    description: "Get All Country",
                    // parameters: [
                    //   {
                    //     name: "ebookGUID",
                    //     in: "path",
                    //     description: "EBook GUID values that need to be considered for filter",
                    //     required: true,
                    //     explode: true,
                    //     schema: {
                    //       type: "string",
                    //     }
                    //   }
                    // ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/allCountry"
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ['/location/state/{countryCode}']: {
                get: {
                    tags: [
                        "Location"
                    ],
                    summary: "Get All State Selected Country",
                    description: "Get All State Selected Country",
                    parameters: [
                        {
                            name: "countryCode",
                            in: "path",
                            description: "Country Code values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/allState"
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            },
            ['/location/city/{countryCode}/{stateCode}']: {
                get: {
                    tags: [
                        "Location"
                    ],
                    summary: "Get All City Selected Country & City",
                    description: "Get All City Selected Country & City",
                    parameters: [
                        {
                            name: "countryCode",
                            in: "path",
                            description: "Country Code values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        },
                        {
                            name: "stateCode",
                            in: "path",
                            description: "State Code values that need to be considered for filter",
                            required: true,
                            explode: true,
                            schema: {
                                type: "string",
                            }
                        }
                    ],
                    responses: {
                        200: {
                            description: "Successful operation",
                            content: {
                                ['application/json']: {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/allCity"
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                user: {
                    type: "object",
                    properties: {
                        userID: { type: "integer", format: "int64", example: 0 },
                        userGUID: { type: "string", example: "xxyyzz" },
                        userName: { type: "string", example: "Test User" },
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                        userStatus: { type: "boolean", format: "int64", example: false },
                        userRole: { type: "string", example: "test" },
                        userCountry: { type: "string", example: "country" },
                        userState: { type: "string", example: "state" },
                        userCity: { type: "string", example: "city" },
                        userCreateDate: { type: "string", example: "yyyy-mm-dd" },
                        userCreateTime: { type: "string", example: "hh:mm:ss" }
                    }
                },
                registrationCreate: {
                    type: "object",
                    properties: {
                        userName: { type: "string", example: "" },
                        userEmail: { type: "string", example: "" },
                        userPassword: { type: "string", example: "" },
                        userCountry: { type: "string", example: "" },
                        userState: { type: "string", example: "" },
                        userCity: { type: "string", example: "" }
                    }
                },
                validateRegistrationRequest: {
                    type: "object",
                    properties: {
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                        userVerificationCode: { type: "integer", example: 123456 },
                    }
                },
                loginRequest: {
                    type: "object",
                    properties: {
                        userEmail: { type: "string", example: "" },
                        userPassword: { type: "string", example: "" },
                    }
                },
                loginResponse: {
                    type: "object",
                    properties: {
                        userID: { type: "integer", format: "int64", example: 0 },
                        userGUID: { type: "string", example: "xxyyzz" },
                        userName: { type: "string", example: "Test User" },
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                        userRole: { type: "string", example: "test" },
                        token: { type: "string", example: "test" }
                    }
                },
                forgotPassworkUserCheckRequest: {
                    type: "object",
                    properties: {
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                    }
                },
                forgotPassworkRequest: {
                    type: "object",
                    properties: {
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                        userPassword: { type: "string", example: "123456" },
                        userVerificationCode: { type: "integer", example: 123456 },
                    }
                },
                userStatusRequest: {
                    type: "object",
                    properties: {
                        userStatus: { type: "integer", example: 0 }
                    }
                },
                userRoleRequest: {
                    type: "object",
                    properties: {
                        userRole: { type: "string", example: "xxyyzz" }
                    }
                },
                loginTrackerResponse: {
                    type: "object",
                    properties: {
                        trackerGUID: { type: "string", example: "xxyyzz" },
                        userGUID: { type: "string", example: "xxyyzz" },
                        userName: { type: "string", example: "Test User" },
                        userEmail: { type: "string", example: "testuser@gmail.com" },
                        trackerType: { type: "string", example: "Login" },
                        trackerCreateDate: { type: "string", example: "2023-10-02" },
                        trackerCreateTime: { type: "string", example: "13:02:02" }
                    }
                },
                galleryCategoryResponse: {
                    type: "object",
                    properties: {
                        galCategoryGUID: { type: "string", example: "xxyyzz" },
                        galCategoryName: { type: "string", example: "Category Title" },
                        galCategoryDescription: { type: "string", example: "Category Description" },
                    }
                },
                galleryCategoryDetailResponse: {
                    type: "object",
                    properties: {
                        galCategoryGUID: { type: "string", example: "xxyyzz" },
                        galCategoryName: { type: "string", example: "Category Title" },
                        galCategoryDescription: { type: "string", example: "Category Description" },
                        createdBy: { type: "string", example: "xxyyzz" },
                        createdDate: { type: "string", example: "2023-10-02n" },
                        createdTime: { type: "string", example: "13:02:02" },
                        modifyBy: { type: "string", example: "xxyyzz" },
                        modifyDate: { type: "string", example: "2023-10-02" },
                        modifyTime: { type: "string", example: "13:02:02" },
                    }
                },
                galleryCategoryCreate: {
                    type: "object",
                    properties: {
                        galCategoryName: { type: "string", example: "" },
                        galCategoryDescription: { type: "string", example: "" }
                        //galCategoryCreateBy: {type: "string", example: "xxxyyyyzzz"}
                    }
                },
                galleryCategoryUpdate: {
                    type: "object",
                    properties: {
                        galCategoryName: { type: "string", example: "" },
                        galCategoryDescription: { type: "string", example: "" }
                        //galCategoryModifyBy: {type: "string", example: "xxxyyyyzzz"}
                    }
                },
                galleryResponse: {
                    type: "object",
                    properties: {
                        galCategoryGUID: { type: "string", example: "xxyyzz" },
                        galCategoryName: { type: "string", example: "Category Title" },
                        galCategoryDescription: { type: "string", example: "Category Description" },
                        galleryList: { type: 'array', example: [{ galleryGUID: "xxyyzz", galleryImagePath: "xxyyzz", createdBy: "xxyyzz" }] }
                    }
                },
                galleryCreate: {
                    type: "object",
                    properties: {
                        categoryGUID: { type: "string", example: "xxyyzz" },
                        galleryImages: { type: "file", example: "Upload Gallery Images" }
                        //galleryCreateBy: {type: "string", example: "xxyyzz"}
                    }
                },
                eventResponse: {
                    type: "object",
                    properties: {
                        eventGUID: { type: "string", example: "xxyyzz" },
                        eventName: { type: "string", example: "xxyyzz" },
                        eventDescription: { type: "string", example: "xxyyzz" }
                    }
                },
                eventDetailResponse: {
                    type: "object",
                    properties: {
                        eventGUID: { type: "string", example: "xxyyzz" },
                        eventName: { type: "string", example: "xxyyzz" },
                        eventDescription: { type: "string", example: "xxyyzz" },
                        eventStatus: { type: "integer", example: 0 },
                        eventCreateBy: { type: "string", example: "xxyyzz" },
                        eventCreateDate: { type: "string", example: "xxyyzz" },
                        eventCreateTime: { type: "string", example: "xxyyzz" },
                        eventModifyBy: { type: "string", example: "xxyyzz" },
                        eventModifyDate: { type: "string", example: "xxyyzz" },
                        eventModifyTime: { type: "string", example: "xxyyzz" }
                    }
                },
                eventCreate: {
                    type: "object",
                    properties: {
                        eventName: { type: "string", example: "xxyyzz" },
                        eventDescription: { type: "string", example: "xxyyzz" },
                        eventStatus: { type: "integer", example: 0 }
                        //eventCreateBy: {type: "string", example: "xxyyzz"}
                    }
                },
                eventUpdate: {
                    type: "object",
                    properties: {
                        eventName: { type: "string", example: "xxyyzz" },
                        eventDescription: { type: "string", example: "xxyyzz" },
                        eventStatus: { type: "integer", example: 0 }
                        //eventModifyBy: {type: "string", example: "xxyyzz"}
                    }
                },
                eBookResponse: {
                    type: "object",
                    properties: {
                        ebookGUID: { type: "string", example: "xxyyzz" },
                        ebookTitle: { type: "string", example: "xxyyzz" },
                        ebookDescription: { type: "string", example: "xxyyzz" },
                        ebookImage: { type: "string", example: "xxyyzz" },
                        ebookStatus: { type: "boolean", example: true },
                        ebookViews: { type: "integer", example: 1 },
                        ebookCreateBy: { type: "string", example: "xxyyzz" },
                        ebookCreateDate: { type: "string", example: "xxyyzz" },
                        ebookCreateTime: { type: "string", example: "xxyyzz" },
                        ebookModifyBy: { type: "string", example: "xxyyzz" },
                        ebookModifyDate: { type: "string", example: "xxyyzz" },
                        ebookModifyTime: { type: "string", example: "xxyyzz" },
                    }
                },
                eBookCreate: {
                    type: "object",
                    properties: {
                        ebookTitle: { type: "string", example: "xxyyzz" },
                        ebookDescription: { type: "string", example: "xxyyzz" },
                        ebookPDF: { type: "string", example: "xxyyzz" },
                        ebookStatus: { type: "integer", example: 1 },
                        ebookImage: { type: "file", example: "Upload EBook Image" }
                    }
                },
                eBookView: {
                    type: "object",
                    properties: {
                        ebookPDF: { type: "string", example: "xxyyzz" }
                    }
                },
                eBookUpdateStatus: {
                    type: "object",
                    properties: {
                        ebookStatus: { type: "integer", example: 1 }
                    }
                },
                eBookTracker: {
                    type: "object",
                    properties: {
                        ebookTitle: { type: "string", example: "xxyyzz" },
                        userName: { type: "string", example: "xxyyzz" },
                        ebookTrackerCreateDate: { type: "string", example: "xxyyzz" },
                        ebookTrackerCreateTime: { type: "string", example: "xxyyzz" }
                    }
                },
                allCountry: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "xxyyzz" },
                        isoCode: { type: "string", example: "xxyyzz" },
                        flag: { type: "string", example: "xxyyzz" },
                        phonecode: { type: "string", example: "xxyyzz" },
                        currency: { type: "string", example: "xxyyzz" },
                        latitude: { type: "string", example: "xxyyzz" },
                        longitude: { type: "string", example: "xxyyzz" },
                        timezones: { type: "array", example: [{ zoneName: "xxyyzz", gmtOffset: 1, gmtOffsetName: "xxyyzz", abbreviation: "xxyyzz", tzName: "xxyyzz" }] }
                    }
                },
                allState: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "xxyyzz" },
                        isoCode: { type: "string", example: "xxyyzz" },
                        countryCode: { type: "string", example: "xxyyzz" },
                        latitude: { type: "string", example: "xxyyzz" },
                        longitude: { type: "string", example: "xxyyzz" }
                    }
                },
                allCity: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "xxyyzz" },
                        countryCode: { type: "string", example: "xxyyzz" },
                        stateCode: { type: "string", example: "xxyyzz" },
                        latitude: { type: "string", example: "xxyyzz" },
                        longitude: { type: "string", example: "xxyyzz" }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
                bearerAuth: []
            }]
    },
    apis: ["./routes/*.js"],
};
exports.swaggerSpecs = (0, swagger_jsdoc_1.default)(options);
