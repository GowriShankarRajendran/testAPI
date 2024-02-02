"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gallery = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const moment_1 = __importDefault(require("moment"));
const checkUserRole_1 = require("../middleware/checkUserRole");
const index_1 = require("../index");
exports.gallery = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/gallery/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname.replace(/ /g, '')}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    }
    else {
        let error = new Error("Upload jpg, jpeg or png files");
        error.message = "Upload jpg, jpeg or png files";
        cb(error, false);
    }
};
const upload = (0, multer_1.default)({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }).array('galleryImages');
//Get All Gallery Image
exports.gallery.get("/", (req, res, next) => {
    let sqlQuery = `select gallery.galleryID, gallery.galleryGUID, gallery.galleryImagePath, galleryCategory.galCategoryGUID, galleryCategory.galCategoryName, galleryCategory.galCategoryDescription, userRegistration.userName as createdBy from gallery
    left join galleryCategory on galleryCategory.galCategoryGUID = gallery.categoryGUID
    left join userRegistration on userRegistration.userGUID = gallery.galleryCreateBy;`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                var galleryList = [];
                var galleryCategoryID = result.map((val) => val.galCategoryGUID).filter((val, index, array) => array.indexOf(val) === index);
                galleryCategoryID.map((val) => {
                    let getData = result.filter((value) => value.galCategoryGUID === val);
                    galleryList.push({ galleryID: getData[0].galleryID, galCategoryGUID: getData[0].galCategoryGUID, galCategoryName: getData[0].galCategoryName, galCategoryDescription: getData[0].galCategoryDescription, galleryList: getData.filter((list) => (delete list.galleryID, delete list.galCategoryGUID, delete list.galCategoryName, delete list.galCategoryDescription)) });
                });
                galleryList.sort((a, b) => b.galleryID - a.galleryID).map(val => delete val.galleryID);
                res.status(200).json({ message: "Gallery Images get successfully", code: 200, value: galleryList });
            }
            else {
                res.status(404).json({ message: "Gallery Images not available", code: 404, value: null });
            }
        }
    });
});
//Add Gallery Image
exports.gallery.post("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    upload(req, res, function (err) {
        let getGallery = req.body;
        if (getGallery.categoryGUID) {
            if (err instanceof multer_1.default.MulterError) {
                //console.log(err, 1);
                res.status(404).json({ message: err ? err.message : 'Image upload failed', code: 404, value: err });
            }
            else if (err) {
                //console.log(err, 2);
                res.status(404).json({ message: err ? err.message : 'Upload jpg, jpeg or png files', code: 404, value: err });
            }
            else {
                let sqlQuery = `insert into gallery (galleryGUID, categoryGUID, galleryImagePath, galleryCreateBy, galleryCreateDate, galleryCreateTime) values `;
                let getFileDetail = req.files;
                if (getFileDetail && getFileDetail.length > 0) {
                    getFileDetail.map((val, index) => {
                        sqlQuery += `(uuid(), "${getGallery.categoryGUID}", "${val.path.replace(/\\/g, '/')}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")${getFileDetail.length === (index + 1) ? ';' : ','}`;
                    });
                    server_1.database.query(sqlQuery, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error", code: 500, value: err });
                        }
                        else {
                            index_1.socketIo.emit('galleryUpdate', Date.now());
                            res.status(201).json({ message: "Gallery images uploaded Successfully", code: 201, value: null });
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
//Delete Gallery Image
exports.gallery.delete("/:galleryGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getGalleryGIUD = `${req.params.galleryGUID}`;
    if (getGalleryGIUD) {
        server_1.database.query(`select galleryImagePath from gallery where galleryGUID = "${getGalleryGIUD}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                if (result && result.length > 0) {
                    let imagePath = result[0].galleryImagePath;
                    fs_1.default.unlink(imagePath, (err) => {
                        if (err) {
                            res.status(404).json({ message: "Gallery image not available", code: 404, value: null });
                        }
                        else {
                            server_1.database.query(`delete from gallery where galleryGUID = "${getGalleryGIUD}"`, (err, result) => {
                                if (err) {
                                    res.status(500).json({ message: "Error", code: 500, value: err });
                                }
                                else {
                                    index_1.socketIo.emit('galleryUpdate', Date.now());
                                    res.status(200).json({ message: "Gallery Image Delete Successfully", code: 200, value: null });
                                }
                            });
                        }
                    });
                }
                else {
                    res.status(404).json({ message: "Please enter valid gallery ID", code: 404, value: null });
                }
            }
        });
    }
});
