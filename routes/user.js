"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../mail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const moment_1 = __importDefault(require("moment"));
const checkUserRole_1 = require("../middleware/checkUserRole");
exports.user = express_1.default.Router();
//Get All User Detail
exports.user.get("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    server_1.database.query("select userID, userGUID, userName, userEmail, userStatus, userRole, userCountry, userState, userCity, userCreateDate, userCreateTime from userRegistration where userVerificationStatus = 1 order by userID", (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "Data get successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "Data not available", code: 404, value: null });
            }
        }
    });
});
//Get User Detail
exports.user.get("/detail/:userGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let userGUID = `${req.params.userGUID}`;
    if (userGUID) {
        server_1.database.query(`select userID, userGUID, userName, userEmail, userStatus, userRole, userCountry, userState, userCity, userCreateDate, userCreateTime from userRegistration where userGUID = "${userGUID}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    res.status(200).json({ message: "Data get successfully", code: 200, value: result[0] });
                }
                else {
                    res.status(404).json({ message: "User not available", code: 404, value: null });
                }
            }
        });
    }
});
//Create User
exports.user.post("/registration", (req, res, next) => {
    let getUserDetail = req.body;
    if (getUserDetail && getUserDetail.userName && getUserDetail.userEmail && getUserDetail.userPassword && getUserDetail.userCountry && getUserDetail.userState && getUserDetail.userCity) {
        server_1.database.query(`select * from userRegistration where userEmail = "${getUserDetail.userEmail}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    res.status(409).json({ message: "Enter email address already available", code: 401, value: null });
                }
                else {
                    let verificationCode = Math.floor(100000 + Math.random() * 900000);
                    let sqlQuery = `insert into userRegistration (userGUID, userName, userEmail, userPassword, userVerificationCode, userVerificationStatus, userStatus, userRole, userCountry, userState, userCity, userCreateDate, userCreateTime) values (
                        uuid(), "${getUserDetail.userName}", "${getUserDetail.userEmail}", "${bcrypt_1.default.hashSync(getUserDetail.userPassword, 10)}", ${verificationCode}, 0, 0, "User", "${getUserDetail.userCountry}", "${getUserDetail.userState}", "${getUserDetail.userCity}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}"
                    )`;
                    var messageBody = `<table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#333;text-align:center;padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><h2 style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:12px;margin-bottom:14px;word-break:break-word;font-size:28px;line-height:38px;font-weight:700">Registration Successfully Created</h2><p style="color:#959ba0;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:22px;word-break:break-word;font-size:17px;line-height:1.5">Hi ${getUserDetail.userName} Congratulations, your registration has been successfully created. Enter verfication code in registration screen.</p><table align="center" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0 auto"><tbody><tr><td style="background-color:#d9efff;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-size:32px;padding:12px;border-radius:4px;line-height:normal;text-align:center;font-weight:700;letter-spacing:12px;-webkit-transition:box-shadow .25s;transition:box-shadow .25s;color:#2196f3;font-family:Arial,Helvetica,sans-serif">${verificationCode}</td></tr></tbody></table></td></tr></tbody></table>`;
                    var emailTemplate = `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Kriya Babaji Email Notification</title></head><body style="background-color:#fff1ea"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="font-size:0;text-align:center;line-height:100%;padding-top:64px;padding-bottom:64px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:800px;margin:0 auto;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="font-size:0;text-align:center;background-color:#fff;border-top:4px solid #e65100;border-radius:4px;padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;"><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><div style="vertical-align:top;display:inline-block;width:100%;max-width:624px"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#e65100;text-align:left;padding-top:8px;padding-bottom:8px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><p style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:0;word-break:break-word;font-size:16px;line-height:100%;clear:both;text-align:center"><a href="https://kriyababajiyogasangam.org/" target="_blank" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-decoration:none;color:#e65100;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:0;word-break:break-word"><img src="https://kriyababajiyogasangam.org/images/logo111.png" width="520" height="87" alt="BlauMail website" style="width:520px;-ms-interpolation-mode:bicubic;border:0;height:87px;line-height:100%;outline:0;text-decoration:none"></a></p></td></tr></tbody></table></div></div><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><div style="vertical-align:top;display:inline-block;width:100%;max-width:416px"><table class="column" align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td height="32" style="vertical-align:top;border-bottom:1px solid #dee0e1;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">&nbsp;</td></tr></tbody></table></div></div><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto">${messageBody}</div></td></tr><tr><td style="font-size:0;text-align:center;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#959ba0;text-align:center;padding-top:16px;padding-bottom:32px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><p style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:8px;word-break:break-word;font-size:16px;line-height:26px">Copyright &#169; ${(0, moment_1.default)().format('YYYY')} by Kriya Babaji Yoga Sangam. All Right Reserved.</p></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></body></html>`;
                    var mailOptions = {
                        from: `${process.env.MAILUSER}`,
                        //to: 'gowrishanker93@gmail.com',//${getUserDetail.userEmail}
                        to: `${getUserDetail.userEmail}`,
                        subject: 'Kriya Babaji Yoga Sangam User Registration Verification',
                        html: `${emailTemplate}`
                    };
                    mail_1.mail.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.status(404).json({ message: "Entered Email ID not Valid", code: 404, value: null });
                        }
                        else {
                            server_1.database.query(sqlQuery, (err, result) => {
                                if (err) {
                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                }
                                else {
                                    res.status(201).json({ message: "User Created Successfully, Check your email and enter verfication code", code: 201, value: null });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//validate Registration
exports.user.patch("/validateRegistration", (req, res, next) => {
    let getUserDetail = req.body;
    if (getUserDetail.userEmail && getUserDetail.userVerificationCode) {
        server_1.database.query(`select userVerificationCode from userRegistration where userEmail = "${getUserDetail.userEmail}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    if (result[0].userVerificationCode === getUserDetail.userVerificationCode) {
                        server_1.database.query(`update userRegistration set userVerificationStatus = 1, userStatus = 1 where userEmail = "${getUserDetail.userEmail}"`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                res.status(200).json({ message: "Registration Validate Successfully", code: 200, value: null });
                            }
                        });
                    }
                    else {
                        res.status(401).json({ message: "Incorrect validation code entered", code: 401, value: null });
                    }
                }
                else {
                    res.status(404).json({ message: "Enter Email ID not available", code: 404, value: null });
                }
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Login
exports.user.post("/login", (req, res, next) => {
    let getLoginDetail = req.body;
    if (getLoginDetail.userEmail && getLoginDetail.userPassword) {
        server_1.database.query(`select userID, userGUID, userName, userEmail, userPassword, userStatus, userVerificationStatus, userRole from userRegistration where userEmail = "${getLoginDetail.userEmail}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    let checkPassword = bcrypt_1.default.compareSync(getLoginDetail.userPassword, result[0].userPassword); //check password all user -> 123456
                    if (checkPassword && result[0].userStatus === 1 && result[0].userVerificationStatus === 1) {
                        let userDetail = { userID: result[0].userID, userGUID: result[0].userGUID, userName: result[0].userName, userEmail: result[0].userEmail, userRole: result[0].userRole.split("#") };
                        let userResponse = Object.assign(Object.assign({}, userDetail), { token: jsonwebtoken_1.default.sign(userDetail, `${process.env.TOKEN}`) });
                        server_1.database.query(`insert into loginTracker (trackerGUID, userGUID, trackerType, trackerCreateDate, trackerCreateTime) values (uuid(), "${userDetail.userGUID}", "Login", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                res.status(200).json({ message: "Login Successfully", code: 200, value: userResponse });
                            }
                        });
                    }
                    else {
                        if (result[0].userStatus === 0) {
                            res.status(401).json({ message: "Account Blocked, Please contact our team", code: 401, value: null });
                        }
                        else if (result[0].userVerificationStatus === 0) {
                            res.status(401).json({ message: "Account Activation Incomplete", code: 401, value: null });
                        }
                        else {
                            res.status(404).json({ message: "Incorrect Password", code: 404, value: null });
                        }
                    }
                }
                else {
                    res.status(404).json({ message: "Enter Email ID not available", code: 404, value: null });
                }
            }
        });
    }
    else {
        res.status(409).json({ message: "Please enter all required fields", code: 409, value: null });
    }
});
//Forgot Password User Check
exports.user.patch("/forgotPassworkUserCheck", (req, res, next) => {
    let getUserEmail = req.body.userEmail;
    if (getUserEmail) {
        server_1.database.query(`select userEmail, userName from userRegistration where userEmail = "${getUserEmail}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    let verificationCode = Math.floor(100000 + Math.random() * 900000);
                    var messageBody = `<table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#333;text-align:center;padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><h2 style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:12px;margin-bottom:14px;word-break:break-word;font-size:28px;line-height:38px;font-weight:700">Password Change Request</h2><p style="color:#959ba0;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:22px;word-break:break-word;font-size:17px;line-height:1.5">Hi ${result[0].userName} we receive password change request. Enter verfication code in forgot password screen.</p><table align="center" border="0" cellspacing="0" cellpadding="0" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0 auto"><tbody><tr><td style="background-color:#d9efff;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-size:32px;padding:12px;border-radius:4px;line-height:normal;text-align:center;font-weight:700;letter-spacing:12px;-webkit-transition:box-shadow .25s;transition:box-shadow .25s;color:#2196f3;font-family:Arial,Helvetica,sans-serif">${verificationCode}</td></tr></tbody></table></td></tr></tbody></table>`;
                    var emailTemplate = `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Kriya Babaji Email Notification</title></head><body style="background-color:#fff1ea"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="font-size:0;text-align:center;line-height:100%;padding-top:64px;padding-bottom:64px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:800px;margin:0 auto;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="font-size:0;text-align:center;background-color:#fff;border-top:4px solid #e65100;border-radius:4px;padding-top:32px;padding-bottom:32px;padding-left:16px;padding-right:16px;"><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><div style="vertical-align:top;display:inline-block;width:100%;max-width:624px"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#e65100;text-align:left;padding-top:8px;padding-bottom:8px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><p style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:0;word-break:break-word;font-size:16px;line-height:100%;clear:both;text-align:center"><a href="https://kriyababajiyogasangam.org/" target="_blank" style="-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;text-decoration:none;color:#e65100;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:0;word-break:break-word"><img src="https://kriyababajiyogasangam.org/images/logo111.png" width="520" height="87" alt="BlauMail website" style="width:520px;-ms-interpolation-mode:bicubic;border:0;height:87px;line-height:100%;outline:0;text-decoration:none"></a></p></td></tr></tbody></table></div></div><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><div style="vertical-align:top;display:inline-block;width:100%;max-width:416px"><table class="column" align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td height="32" style="vertical-align:top;border-bottom:1px solid #dee0e1;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">&nbsp;</td></tr></tbody></table></div></div><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto">${messageBody}</div></td></tr><tr><td style="font-size:0;text-align:center;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><div style="font-size:0;text-align:center;max-width:624px;margin:0 auto"><table align="center" width="100%" cellspacing="0" cellpadding="0" border="0" style="vertical-align:top;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><tbody><tr><td style="vertical-align:top;color:#959ba0;text-align:center;padding-top:16px;padding-bottom:32px;padding-left:16px;padding-right:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%"><p style="color:inherit;font-family:Arial,Helvetica,sans-serif;margin-top:0;margin-bottom:8px;word-break:break-word;font-size:16px;line-height:26px">Copyright &#169; ${(0, moment_1.default)().format('YYYY')} by Kriya Babaji Yoga Sangam. All Right Reserved.</p></td></tr></tbody></table></div></td></tr></tbody></table></td></tr></tbody></table></body></html>`;
                    var mailOptions = {
                        from: `${process.env.MAILUSER}`,
                        //to: 'gowrishanker93@gmail.com',//${getUserEmail}
                        to: `${getUserEmail}`,
                        subject: 'Kriya Babaji Yoga Sangam Forgot Password Verification',
                        html: `${emailTemplate}`
                    };
                    mail_1.mail.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            res.status(404).json({ message: "Entered Email ID not Valid", code: 404, value: null });
                        }
                        else {
                            let sqlQuery = `update userRegistration set userVerificationCode = ${verificationCode} where userEmail = "${getUserEmail}"`;
                            server_1.database.query(sqlQuery, (err, result) => {
                                if (err) {
                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                }
                                else {
                                    res.status(201).json({ message: "Check your email and enter verfication code", code: 201, value: null });
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(404).json({ message: "Enter Email ID not available", code: 404, value: null });
                }
            }
        });
    }
    else {
        res.status(409).json({ message: "Please enter all required fields", code: 409, value: null });
    }
});
//Forgot Password
exports.user.patch("/forgotPassword", (req, res, next) => {
    let getUserDetail = req.body;
    if (getUserDetail.userEmail && getUserDetail.userPassword && getUserDetail.userVerificationCode) {
        server_1.database.query(`select userEmail, userVerificationCode from userRegistration where userEmail = "${getUserDetail.userEmail}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    if (result[0].userVerificationCode === getUserDetail.userVerificationCode) {
                        server_1.database.query(`update userRegistration set userPassword = "${bcrypt_1.default.hashSync(getUserDetail.userPassword, 10)}" where userEmail = "${getUserDetail.userEmail}"`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                res.status(201).json({ message: "Password Updated Successfully", code: 201, value: null });
                            }
                        });
                    }
                    else {
                        res.status(404).json({ message: "Enter varification code invalid", code: 404, value: null });
                    }
                }
                else {
                    res.status(404).json({ message: "Enter Email ID not available", code: 404, value: null });
                }
            }
        });
    }
    else {
        res.status(409).json({ message: "Please enter all required fields", code: 409, value: null });
    }
});
//Change User Status
exports.user.patch("/userStatus/:userGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    let getUserGUID = `${req.params.userGUID}`;
    let getUserStatus = +`${req.body.userStatus}`;
    server_1.database.query(`update userRegistration set userStatus = ${getUserStatus}, modifyBy = "${userInfo.userGUID}", modifyDate = "${(0, moment_1.default)().format('YYYY-MM-DD')}", modifyTime = "${(0, moment_1.default)().format('HH:mm:ss')}" where userGUID = "${getUserGUID}"`, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            res.status(200).json({ message: "User Status Updated Successfully", code: 200, value: null });
        }
    });
});
//Change User Role
exports.user.patch("/userRole/:userGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    let getUserGUID = `${req.params.userGUID}`;
    let getUserRole = `${req.body.userRole}`;
    server_1.database.query(`update userRegistration set userRole = "${getUserRole}", modifyBy = "${userInfo.userGUID}", modifyDate = "${(0, moment_1.default)().format('YYYY-MM-DD')}", modifyTime = "${(0, moment_1.default)().format('HH:mm:ss')}" where userGUID = "${getUserGUID}"`, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            res.status(200).json({ message: "User Role Updated Successfully", code: 200, value: null });
        }
    });
});
//Refresh Token
exports.user.get("/refreshToken", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['User']);
}, (userInfo, req, res, next) => {
    //let userGUID: string = `${req.params.userGUID}`;
    let userGUID = `${userInfo.userGUID}`;
    if (userGUID) {
        server_1.database.query(`select userID, userGUID, userName, userEmail, userPassword, userStatus, userVerificationStatus, userRole from userRegistration where userGUID = "${userGUID}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    if (result[0].userStatus === 1 && result[0].userVerificationStatus === 1) {
                        let userDetail = { userID: result[0].userID, userGUID: result[0].userGUID, userName: result[0].userName, userEmail: result[0].userEmail, userRole: result[0].userRole.split("#") };
                        let userResponse = Object.assign(Object.assign({}, userDetail), { token: jsonwebtoken_1.default.sign(userDetail, `${process.env.TOKEN}`) });
                        server_1.database.query(`insert into loginTracker (trackerGUID, userGUID, trackerType, trackerCreateDate, trackerCreateTime) values (uuid(), "${userDetail.userGUID}", "Login", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                res.status(200).json({ message: "User Verify Successfully", code: 200, value: userResponse });
                            }
                        });
                    }
                    else if (result[0].userStatus === 0) {
                        res.status(401).json({ message: "Account Blocked, Please contact our team", code: 401, value: null });
                    }
                    else {
                        res.status(401).json({ message: "Account Activation Incomplete", code: 401, value: null });
                    }
                }
                else {
                    res.status(401).json({ message: "Unauthorized User", code: 401, value: null });
                }
            }
        });
    }
});
//Logout
exports.user.get("/logout", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin', 'User']);
}, (userInfo, req, res, next) => {
    let userGUID = `${userInfo.userGUID}`;
    if (userGUID) {
        server_1.database.query(`insert into loginTracker (trackerGUID, userGUID, trackerType, trackerCreateDate, trackerCreateTime) values (uuid(), "${userGUID}", "Logout", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                res.status(200).json({ message: "Logout Successfully", code: 200, value: null });
            }
        });
    }
});
//Login Tracker
exports.user.get("/loginTracker/:fromDate/:toDate", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let userGUID = req.query.userGUID ? `${req.query.userGUID}` : null;
    let fromDate = `${req.params.fromDate}`;
    let toDate = `${req.params.toDate}`;
    let sqlQuery = userGUID && userGUID.length > 0 ? `select loginTracker.trackerID, loginTracker.trackerGUID, userRegistration.userGUID, userRegistration.userName, userRegistration.userEmail, loginTracker.trackerType, loginTracker.trackerCreateDate, loginTracker.trackerCreateTime from loginTracker left join userRegistration on loginTracker.userGUID = userRegistration.userGUID where (loginTracker.userGUID = "${userGUID}") AND (loginTracker.trackerCreateDate BETWEEN "${fromDate}" AND "${toDate}") order by trackerID desc` : `select loginTracker.trackerID, loginTracker.trackerGUID, userRegistration.userGUID, userRegistration.userName, userRegistration.userEmail, loginTracker.trackerType, loginTracker.trackerCreateDate, loginTracker.trackerCreateTime from loginTracker left join userRegistration on loginTracker.userGUID = userRegistration.userGUID where loginTracker.trackerCreateDate BETWEEN "${fromDate}" AND "${toDate}" order by trackerID desc`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "User Verify Successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "Login Tracker not available applied filter", code: 404, value: null });
            }
        }
    });
});
