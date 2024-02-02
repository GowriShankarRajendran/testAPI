"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.event = void 0;
const express_1 = __importDefault(require("express"));
const server_1 = require("../server");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const moment_1 = __importDefault(require("moment"));
const checkUserRole_1 = require("../middleware/checkUserRole");
const index_1 = require("../index");
exports.event = express_1.default.Router();
//Get Event List
exports.event.get("/", (req, res, next) => {
    let sqlQuery = `select eventGUID, eventName, eventDescription from event where eventStatus = 1 order by eventID desc`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "Event get successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "Event not available", code: 404, value: null });
            }
        }
    });
});
//Get Event Detail List
exports.event.get("/Detail", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let sqlQuery = `select event.eventGUID, event.eventName, event.eventDescription, event.eventStatus, createBy.userName as eventCreateBy, eventCreateDate, eventCreateTime, modifyBy.userName as eventModifyBy, eventModifyDate, eventModifyTime from event
        left join userRegistration as createBy on createBy.userGUID = event.eventCreateBy
        left join userRegistration as modifyBy on modifyBy.userGUID = event.eventModifyBy order by eventID desc;`;
    server_1.database.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error", code: 500, value: err });
        }
        else {
            if (result && result.length > 0) {
                res.status(200).json({ message: "Event detail get successfully", code: 200, value: result });
            }
            else {
                res.status(404).json({ message: "Event not available", code: 404, value: null });
            }
        }
    });
});
//Create Event
exports.event.post("/", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getEventDetail = req.body;
    if (getEventDetail.eventName && getEventDetail.eventDescription && getEventDetail.eventStatus >= 0) {
        let sqlQuery = `insert into event (eventGUID, eventName, eventDescription, eventStatus, eventCreateBy, eventCreateDate, eventCreateTime, eventModifyBy, eventModifyDate, eventModifyTime) values (
                uuid(), "${getEventDetail.eventName}", "${getEventDetail.eventDescription}", ${getEventDetail.eventStatus}, "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}", "${userInfo.userGUID}", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}"
            )`;
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                index_1.socketIo.emit('eventUpdate', Date.now());
                res.status(201).json({ message: "Event Create Successfully", code: 201, value: null });
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Update Event
exports.event.put("/:eventGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getEventGUID = req.params.eventGUID;
    let getUpdateDetail = req.body;
    if (getEventGUID && getUpdateDetail.eventName && getUpdateDetail.eventDescription && getUpdateDetail.eventStatus >= 0) {
        let sqlQuery = `update event set eventName="${getUpdateDetail.eventName}", eventDescription="${getUpdateDetail.eventDescription}", eventStatus=${getUpdateDetail.eventStatus}, eventModifyBy="${userInfo.userGUID}", eventModifyDate="${(0, moment_1.default)().format('YYYY-MM-DD')}", eventModifyTime="${(0, moment_1.default)().format('HH:mm:ss')}" where eventGUID = "${getEventGUID}"`;
        server_1.database.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                index_1.socketIo.emit('eventUpdate', Date.now());
                res.status(200).json({ message: "Event Updated Successfully", code: 200, value: null });
            }
        });
    }
    else {
        res.status(401).json({ message: "Please enter all required fields", code: 401, value: null });
    }
});
//Delete Event
exports.event.delete("/:eventGUID", (req, res, next) => {
    (0, checkUserRole_1.checkUserRole)(req, res, next, ['Admin']);
}, (userInfo, req, res, next) => {
    let getEventGUID = req.params.eventGUID;
    if (getEventGUID) {
        server_1.database.query(`delete from event where eventGUID = "${getEventGUID}"`, (err, result) => {
            if (err) {
                res.status(500).json({ message: "Error", code: 500, value: err });
            }
            else {
                index_1.socketIo.emit('eventUpdate', Date.now());
                res.status(200).json({ message: "Event Deleted Successfully", code: 200, value: null });
            }
        });
    }
});
