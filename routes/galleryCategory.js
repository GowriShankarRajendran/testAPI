"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryCategory = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const moment_1 = __importDefault(require("moment"));
const checkUserRole_1 = require("../middleware/checkUserRole");
const index_1 = require("../index");
exports.galleryCategory = express_1.default.Router();
//Get All Gallery Category
exports.galleryCategory.get("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    server_1.database.query(`select galCategoryGUID, galCategoryName, galCategoryDescription from galleryCategory order by galCategoryID desc`, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "Gallery Category get successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "Gallery Category not available", code: 404, value: null });
            }
        }
    });
});
//Get Gallery Category Detail
exports.galleryCategory.get("/:galCategoryGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let galCategoryGUID = `${req.params.galCategoryGUID}`;
    if (galCategoryGUID) {
        let sqlQuery = `select galleryCategory.galCategoryName, galleryCategory.galCategoryDescription, galleryCategory.galCategoryGUID, createdBy.userName as createdBy, galleryCategory.galCategoryCreateDate as createdDate, galleryCategory.galCategoryCreateTime as createdTime, modifyed.userName as modifyBy, galleryCategory.galCategoryModifyDate as modifyDate, galleryCategory.galCategoryModifyTime as modifyTime from galleryCategory
            left join userRegistration as createdBy on galleryCategory.galCategoryCreateBy = createdBy.userGUID
            left join userRegistration as modifyed on galleryCategory.galCategoryModifyBy = modifyed.userGUID where galleryCategory.galCategoryGUID = "${galCategoryGUID}";`;
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    res.status(200).json({ message: "Gallery Category get successfully", code: 200, value: result[0] });
                }
                else {
                    res.status(404).json({ message: "Gallery Category not available", code: 404, value: null });
                }
            }
        });
    }
});
//Create Gallery Category
exports.galleryCategory.post("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let galCategoryDetail = req.body;
    if (galCategoryDetail.galCategoryName) {
        let sqlQuery = `insert into galleryCategory (galCategoryGUID, galCategoryName, galCategoryDescription, galCategoryCreateBy, galCategoryCreateDate, galCategoryCreateTime, galCategoryModifyBy, galCategoryModifyDate, galCategoryModifyTime) values (
                uuid(), "${galCategoryDetail.galCategoryName}", "${galCategoryDetail.galCategoryDescription ? galCategoryDetail.galCategoryDescription : null}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}"
            )`;
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                res.status(201).json({ message: "Gallery Category Created Successfully", code: 201, value: null });
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Update Gallery Category
exports.galleryCategory.put("/:galCategoryGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getGalCategoryGUID = `${req.params.galCategoryGUID}`;
    let galCategoryDetail = req.body;
    if (getGalCategoryGUID && galCategoryDetail.galCategoryName) {
        let sqlQuery = "";
        if (galCategoryDetail.galCategoryDescription) {
            sqlQuery = `update galleryCategory set galCategoryName = "${galCategoryDetail.galCategoryName}", galCategoryDescription = "${galCategoryDetail.galCategoryDescription}", galCategoryModifyBy = "${userInfo.userGUID}", galCategoryModifyDate = "${(0, moment_1.default)().format('YYYY-MM-DD')}", galCategoryModifyTime = "${(0, moment_1.default)().format('HH:mm:ss')}" where galCategoryGUID = "${getGalCategoryGUID}"`;
        }
        else {
            sqlQuery = `update galleryCategory set galCategoryName = "${galCategoryDetail.galCategoryName}", galCategoryModifyBy = "${userInfo.userGUID}", galCategoryModifyDate = "${(0, moment_1.default)().format('YYYY-MM-DD')}", galCategoryModifyTime = "${(0, moment_1.default)().format('HH:mm:ss')}" where galCategoryGUID = "${getGalCategoryGUID}"`;
        }
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                index_1.socketIo.emit('galleryUpdate', Date.now());
                res.status(200).json({ message: "Gallery Category Updated Successfully", code: 200, value: null });
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Delete Gallery Category
exports.galleryCategory.delete("/:galCategoryGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getGalCategoryGUID = `${req.params.galCategoryGUID}`;
    if (getGalCategoryGUID) {
        server_1.database.query(`select galleryImagePath from gallery where categoryGUID = "${getGalCategoryGUID}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    result.map((val, index) => {
                        fs_1.default.unlink(val.galleryImagePath, (err) => { });
                        if ((index + 1) === result.length) {
                            server_1.database.query(`delete from gallery where categoryGUID = "${getGalCategoryGUID}"`, (err, result) => {
                                if (err) {
                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                }
                                else {
                                    server_1.database.query(`delete from galleryCategory where galCategoryGUID = "${getGalCategoryGUID}"`, (err, result) => {
                                        if (err) {
                                            res.status(500).json({ message: "Error", code: 500, value: err });
                                        }
                                        else {
                                            index_1.socketIo.emit('galleryUpdate', Date.now());
                                            res.status(200).json({ message: "Gallery Category Delete Successfully", code: 200, value: null });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    server_1.database.query(`delete from galleryCategory where galCategoryGUID = "${getGalCategoryGUID}"`, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error", code: 500, value: err });
                        }
                        else {
                            index_1.socketIo.emit('galleryUpdate', Date.now());
                            res.status(200).json({ message: "Gallery Category Delete Successfully", code: 200, value: null });
                        }
                    });
                }
            }
        });
    }
});
