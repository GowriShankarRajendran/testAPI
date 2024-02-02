"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserRole = void 0;
const server_1 = require("../server");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.checkUserRole = ((req, res, next, role) => {
    let checkTokenAvailable = req.rawHeaders.includes('Authorization');
    let getBearerIndex = req.rawHeaders.findIndex(val => String(val).startsWith("Bearer"));
    if (checkTokenAvailable && getBearerIndex >= 0) {
        let getToken = jsonwebtoken_1.default.verify(req.rawHeaders[getBearerIndex].slice(7), `${process.env.TOKEN}`);
        if (getToken) {
            server_1.database.query(`select userGUID, userRole, userStatus from userRegistration where userGUID = "${getToken.userGUID}"`, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Error", code: 500, value: err });
                }
                else {
                    if (result && result.length > 0) {
                        if (result[0].userStatus) {
                            let getUserRole = result[0].userRole.split("#").map((val) => val.toLowerCase());
                            let checkUserAccess = false;
                            for (let i = 0; i < role.length; i++) {
                                checkUserAccess = getUserRole.includes(role[i].toLowerCase());
                                if (checkUserAccess) {
                                    break;
                                }
                                else {
                                    continue;
                                }
                            }
                            if (checkUserAccess) {
                                let userInfo = { userGUID: result[0].userGUID, userRole: getUserRole };
                                next(userInfo);
                            }
                            else {
                                res.status(403).json({ message: "You not have access", code: 403, value: null });
                            }
                        }
                        else {
                            res.status(403).json({ message: "Your account blocked, Please contact admin", code: 403, value: null });
                        }
                    }
                    else {
                        res.status(404).json({ message: "User not available", code: 404, value: null });
                    }
                }
            });
        }
        else {
            res.status(401).json({ message: "Unauthorized User", code: 401, value: null });
        }
    }
    else {
        res.status(401).json({ message: "Unauthorized User", code: 401, value: null });
    }
});
