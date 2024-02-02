"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eBook = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const checkUserRole_1 = require("../middleware/checkUserRole");
const moment_1 = __importDefault(require("moment"));
const index_1 = require("../index");
exports.eBook = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/ebook/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname.replace(/ /g, '')}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "application/pdf") {
        cb(null, true);
    }
    else {
        let error = new Error("Upload jpg, jpeg or png files");
        error.message = "Upload jpg, jpeg or png files";
        cb(error, false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 1024 } })
    .fields([{ name: 'ebookImage', maxCount: 1 }, { name: 'ebookPDF', maxCount: 1 }]);
//.single('ebookImage');
//Get All EBook
exports.eBook.get("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin', 'User']);
}, (userInfo, req, res, next) => {
    let role = userInfo.userRole;
    let sqlQuery = role.includes("admin") ? `select eBook.ebookGUID, eBook.ebookTitle, eBook.ebookDescription, eBook.ebookImage, eBook.ebookStatus,
        (select count(ebookGUID) from ebookTracker where ebookTracker.ebookGUID = eBook.ebookGUID) as ebookViews, createUser.userName as ebookCreateBy, eBook.ebookCreateDate, eBook.ebookCreateTime, modifyUser.userName as ebookModifyBy, eBook.ebookModifyDate, eBook.ebookModifyTime from eBook
        left join userRegistration as createUser on eBook.ebookCreateBy = createUser.userGUID
        left join userRegistration as modifyUser on eBook.ebookModifyBy = modifyUser.userGUID order by ebookID desc;` :
        `select eBook.ebookGUID, eBook.ebookTitle, eBook.ebookDescription, eBook.ebookImage, eBook.ebookStatus, (select count(ebookGUID) from ebookTracker where ebookTracker.ebookGUID = eBook.ebookGUID) as ebookViews, eBook.ebookCreateDate, eBook.ebookCreateTime from eBook where eBook.ebookStatus = 1 order by ebookID desc;`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                result.map((val) => val.ebookStatus = val.ebookStatus ? true : false);
                res.status(200).json({ message: "EBook get successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "EBook not available", code: 404, value: null });
            }
        }
    });
});
//Get EBook Detail
exports.eBook.get("/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin', 'User']);
}, (userInfo, req, res, next) => {
    let getEBookGUID = `${req.params.ebookGUID}`;
    let sqlQuery = `select CONVERT(eBook.ebookPDF USING utf8) as ebookPDF from eBook where eBook.ebookGUID = "${getEBookGUID}"`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                let eBookTrackerQuery = `insert into ebookTracker (ebookTrackerGUID, ebookGUID, userGUID, ebookTrackerCreateDate, ebookTrackerCreateTime) values (
                        uuid(), "${getEBookGUID}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`;
                server_1.database.query(eBookTrackerQuery, (err, trackerResult) => {
                    if (err) {
                        res.status(500).json({ message: "Error", code: 500, value: err });
                    }
                    else {
                        res.status(200).json({ message: "EBook get successfully", code: 200, value: result[0] });
                    }
                });
            }
            else {
                res.status(404).json({ message: "EBook not available", code: 404, value: null });
            }
        }
    });
});
//Add EBook
exports.eBook.post("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    upload(req, res, function (err) {
        let getEBookDetail = req.body;
        //if(getEBookDetail.ebookTitle && getEBookDetail.ebookDescription && getEBookDetail.ebookPDF && getEBookDetail.ebookStatus >= 0){
        if (getEBookDetail.ebookTitle && getEBookDetail.ebookDescription && getEBookDetail.ebookStatus >= 0) {
            if (err instanceof multer_1.default.MulterError) {
                //console.log(err, 1);
                res.status(404).json({ message: err ? err.message : 'Image upload failed', code: 404, value: err });
            }
            else if (err) {
                //console.log(err, 2);
                res.status(404).json({ message: err ? err.message : 'Upload jpg, jpeg or png files', code: 404, value: err });
            }
            else {
                //let getEBookImage = req.file;
                let getFiles = JSON.parse(JSON.stringify(req.files));
                let getEBookImage = getFiles.ebookImage[0];
                let getEBookPDF = fs_1.default.readFileSync(`${getFiles.ebookPDF[0].path}`, { encoding: 'base64' });
                fs_1.default.unlink(getFiles.ebookPDF[0].path, (err) => { });
                if (getEBookImage) {
                    let sqlQuery = `insert into eBook (ebookGUID, ebookTitle, ebookDescription, ebookPDF, ebookImage, ebookViews, ebookStatus, ebookCreateBy, ebookCreateDate, ebookCreateTime, ebookModifyBy, ebookModifyDate, ebookModifyTime) values (
                            uuid(), "${getEBookDetail.ebookTitle}", "${getEBookDetail.ebookDescription}", "data:application/pdf;base64,${getEBookPDF}", "${getEBookImage.path.replace(/\\/g, '/')}", 0, ${getEBookDetail.ebookStatus}, "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`;
                    server_1.database.query(sqlQuery, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error", code: 500, value: err });
                        }
                        else {
                            index_1.socketIo.emit('ebookUpdate', Date.now());
                            res.status(201).json({ message: "EBook uploaded Successfully", code: 201, value: null });
                        }
                    });
                }
                else {
                    res.status(404).json({ message: "Please upload file", code: 404, value: null });
                }
            }
        }
        else {
            res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
        }
    });
});
//Update EBook
exports.eBook.put("/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    upload(req, res, function (err) {
        let getEBookGUID = `${req.params.ebookGUID}`;
        let getEBookDetail = req.body;
        if (getEBookDetail.ebookTitle && getEBookDetail.ebookDescription && getEBookDetail.ebookStatus >= 0) {
            if (err instanceof multer_1.default.MulterError) {
                //console.log(err, 1);
                res.status(404).json({ message: err ? err.message : 'Image upload failed', code: 404, value: err });
            }
            else if (err) {
                //console.log(err, 2);
                res.status(404).json({ message: err ? err.message : 'Upload jpg, jpeg or png files', code: 404, value: err });
            }
            else {
                //let getEBookImage = req.file;
                let getFiles = JSON.parse(JSON.stringify(req.files));
                let getEBookImage = null;
                let getEBookPDF = null;
                if (Object.keys(getFiles).length) {
                    getEBookImage = getFiles && (getFiles === null || getFiles === void 0 ? void 0 : getFiles.ebookImage) ? getFiles.ebookImage[0] : null;
                    getEBookPDF = getFiles && (getFiles === null || getFiles === void 0 ? void 0 : getFiles.ebookPDF) ? getFiles.ebookPDF[0] : null;
                    if (getEBookImage && getEBookPDF) {
                        server_1.database.query(`select ebookImage from eBook where ebookGUID = "${getEBookGUID}"`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                if (result && result.length > 0) {
                                    let ebookPDF = fs_1.default.readFileSync(`${getEBookPDF.path}`, { encoding: 'base64' });
                                    fs_1.default.unlink(getEBookPDF.path, (err) => { });
                                    let imagePath = result[0].ebookImage;
                                    fs_1.default.unlink(imagePath, (err) => {
                                        if (err) {
                                            res.status(404).json({ message: "EBook image not available", code: 404, value: null });
                                        }
                                        else {
                                            let sqlQuery = `update eBook set ebookTitle="${getEBookDetail.ebookTitle}", ebookDescription="${getEBookDetail.ebookDescription}", ebookPDF="data:application/pdf;base64,${ebookPDF}", ebookImage="${getEBookImage === null || getEBookImage === void 0 ? void 0 : getEBookImage.path.replace(/\\/g, '/')}", ebookStatus="${getEBookDetail.ebookStatus}", ebookModifyBy="${userInfo.userGUID}", ebookModifyDate="${(0, moment_1.default)().format('YYYY-MM-DD')}", ebookModifyTime="${(0, moment_1.default)().format('HH:mm:ss')}" where ebookGUID = "${getEBookGUID}"`;
                                            server_1.database.query(sqlQuery, (err, result) => {
                                                if (err) {
                                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                                }
                                                else {
                                                    index_1.socketIo.emit('ebookUpdate', Date.now());
                                                    res.status(200).json({ message: "EBook Updated Successfully", code: 200, value: null });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({ message: "Please enter valid EBook ID", code: 404, value: null });
                                }
                            }
                        });
                    }
                    else if (getEBookImage && !getEBookPDF) {
                        server_1.database.query(`select ebookImage from eBook where ebookGUID = "${getEBookGUID}"`, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                if (result && result.length > 0) {
                                    let imagePath = result[0].ebookImage;
                                    fs_1.default.unlink(imagePath, (err) => {
                                        if (err) {
                                            res.status(404).json({ message: "EBook image not available", code: 404, value: null });
                                        }
                                        else {
                                            let sqlQuery = `update eBook set ebookTitle="${getEBookDetail.ebookTitle}", ebookDescription="${getEBookDetail.ebookDescription}", ebookImage="${getEBookImage === null || getEBookImage === void 0 ? void 0 : getEBookImage.path.replace(/\\/g, '/')}", ebookStatus="${getEBookDetail.ebookStatus}", ebookModifyBy="${userInfo.userGUID}", ebookModifyDate="${(0, moment_1.default)().format('YYYY-MM-DD')}", ebookModifyTime="${(0, moment_1.default)().format('HH:mm:ss')}" where ebookGUID = "${getEBookGUID}"`;
                                            server_1.database.query(sqlQuery, (err, result) => {
                                                if (err) {
                                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                                }
                                                else {
                                                    index_1.socketIo.emit('ebookUpdate', Date.now());
                                                    res.status(200).json({ message: "EBook Updated Successfully", code: 200, value: null });
                                                }
                                            });
                                        }
                                    });
                                }
                                else {
                                    res.status(404).json({ message: "Please enter valid EBook ID", code: 404, value: null });
                                }
                            }
                        });
                    }
                    else if (!getEBookImage && getEBookPDF) {
                        let ebookPDF = fs_1.default.readFileSync(`${getEBookPDF.path}`, { encoding: 'base64' });
                        fs_1.default.unlink(getEBookPDF.path, (err) => { });
                        let sqlQuery = `update eBook set ebookTitle="${getEBookDetail.ebookTitle}", ebookDescription="${getEBookDetail.ebookDescription}", ebookPDF="data:application/pdf;base64,${ebookPDF}", ebookStatus="${getEBookDetail.ebookStatus}", ebookModifyBy="${userInfo.userGUID}", ebookModifyDate="${(0, moment_1.default)().format('YYYY-MM-DD')}", ebookModifyTime="${(0, moment_1.default)().format('HH:mm:ss')}" where ebookGUID = "${getEBookGUID}"`;
                        server_1.database.query(sqlQuery, (err, result) => {
                            if (err) {
                                res.status(500).json({ message: "Error", code: 500, value: err });
                            }
                            else {
                                index_1.socketIo.emit('ebookUpdate', Date.now());
                                res.status(200).json({ message: "EBook Updated Successfully", code: 200, value: null });
                            }
                        });
                    }
                }
                else {
                    let sqlQuery = `update eBook set ebookTitle="${getEBookDetail.ebookTitle}", ebookDescription="${getEBookDetail.ebookDescription}", ebookStatus="${getEBookDetail.ebookStatus}", ebookModifyBy="${userInfo.userGUID}", ebookModifyDate="${(0, moment_1.default)().format('YYYY-MM-DD')}", ebookModifyTime="${(0, moment_1.default)().format('HH:mm:ss')}" where ebookGUID = "${getEBookGUID}"`;
                    server_1.database.query(sqlQuery, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error", code: 500, value: err });
                        }
                        else {
                            index_1.socketIo.emit('ebookUpdate', Date.now());
                            res.status(200).json({ message: "EBook Updated Successfully", code: 200, value: null });
                        }
                    });
                }
            }
        }
    });
});
//Change EBook Status
exports.eBook.patch("/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    let getEBookGUID = `${req.params.ebookGUID}`;
    let geteBookStatus = +`${req.body.ebookStatus}`;
    if (geteBookStatus >= 0) {
        let sqlQuery = `update eBook set ebookStatus = ${geteBookStatus}, ebookModifyBy = "${userInfo.userGUID}", ebookModifyDate = "${(0, moment_1.default)().format('YYYY-MM-DD')}", ebookModifyTime = "${(0, moment_1.default)().format('HH:mm:ss')}" where ebookGUID = "${getEBookGUID}"`;
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                index_1.socketIo.emit('ebookUpdate', Date.now());
                res.status(200).json({ message: "EBook Status Updated Successfully", code: 200, value: null });
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Delete EBook
exports.eBook.delete("/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    let getEBookGUID = `${req.params.ebookGUID}`;
    if (getEBookGUID) {
        server_1.database.query(`select ebookImage from eBook where ebookGUID = "${getEBookGUID}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    let imagePath = result[0].ebookImage;
                    fs_1.default.unlink(imagePath, (err) => {
                        if (err) {
                            res.status(404).json({ message: "EBook image not available", code: 404, value: null });
                        }
                        else {
                            server_1.database.query(`delete from ebookTracker where ebookGUID = "${getEBookGUID}"`, (err, result) => {
                                if (err) {
                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                }
                                else {
                                    server_1.database.query(`delete from eBook where ebookGUID = "${getEBookGUID}"`, (err, result) => {
                                        if (err) {
                                            res.status(500).json({ message: "Error", code: 500, value: err });
                                        }
                                        else {
                                            index_1.socketIo.emit('ebookUpdate', Date.now());
                                            res.status(200).json({ message: "EBook Deleted Successfully", code: 200, value: null });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(404).json({ message: "Please enter valid EBook ID", code: 404, value: null });
                }
            }
        });
    }
});
//Get EBook Update Detail
exports.eBook.get("/update/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getEBookGUID = `${req.params.ebookGUID}`;
    let sqlQuery = `select CONVERT(eBook.ebookPDF USING utf8) as ebookPDF from eBook where ebookGUID = "${getEBookGUID}"`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "EBook get successfully", code: 200, value: result[0] });
            }
            else {
                res.status(404).json({ message: "EBook not available", code: 404, value: null });
            }
        }
    });
});
//EBook Tracker
exports.eBook.get("/tracker/:ebookGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ["Admin"]);
}, (userInfo, req, res, next) => {
    let getEBookGUID = `${req.params.ebookGUID}`;
    let sqlQuery = `select eBook.ebookTitle as ebookTitle, userRegistration.userName as userName, userRegistration.userEmail as userEmail, ebookTracker.ebookTrackerCreateDate, ebookTracker.ebookTrackerCreateTime from ebookTracker
            inner join eBook on ebookTracker.ebookGUID = eBook.ebookGUID
            inner join userRegistration on ebookTracker.userGUID = userRegistration.userGUID where ebookTracker.ebookGUID = "${getEBookGUID}" order by ebookTrackerID desc`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "EBook Tracker get Successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "EBook Tracker not available", code: 404, value: null });
            }
        }
    });
});
