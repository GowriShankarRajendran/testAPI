"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRegistration = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
exports.userRegistration = express_1.default.Router();
//Get All User Detail
exports.userRegistration.get("/", (req, res, next) => {
    server_1.database.query("select * from userRegistration", (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "Data get successfully", code: 200, value: result });
            }
            else {
                res.status(200).json({ message: "Data not available", code: 404, value: result });
            }
        }
    });
});
//Create User
exports.userRegistration.post("/", (req, res, next) => {
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
                        uuid(), "${getUserDetail.userName}", "${getUserDetail.userEmail}", "${bcrypt_1.default.hashSync(getUserDetail.userPassword, 10)}", ${verificationCode}, 0, 0, "user", "${getUserDetail.userCountry}", "${getUserDetail.userState}", "${getUserDetail.userCity}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('hh:mm:ss')}"
                    )`;
                    //bcrypt.compareSync(myPlaintextPassword, hash); check password Postman User 2 -> postman
                    server_1.database.query(sqlQuery, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error", code: 500, value: err });
                        }
                        else {
                            res.status(201).json({ message: "User Created Successfully", code: 201, value: null });
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
