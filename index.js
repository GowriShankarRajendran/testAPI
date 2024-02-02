"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIo = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const server_1 = require("./server");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_setting_1 = require("./swagger-setting");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const moment_1 = __importDefault(require("moment"));
//Routes
const user_1 = require("./routes/user");
const galleryCategory_1 = require("./routes/galleryCategory");
const gallery_1 = require("./routes/gallery");
const event_1 = require("./routes/event");
const ebook_1 = require("./routes/ebook");
const location_1 = require("./routes/location");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.socketIo = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    }
});
const port = process.env.PORT;
var onlineUserDetail = [];
app.use('/upload', express_1.default.static('upload'));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    // if (req.method === "OPTIONS") {
    //   res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    //   return res.status(200).json({});
    // }
    next();
});
//Routes
app.use("/user", user_1.user);
app.use("/galleryCategory", galleryCategory_1.galleryCategory);
app.use("/gallery", gallery_1.gallery);
app.use("/event", event_1.event);
app.use("/eBook", ebook_1.eBook);
app.use("/location", location_1.location);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_setting_1.swaggerSpecs, { explorer: true }));
//Route Not Found
app.use("", (req, res, next) => {
    const error = new Error("route not found");
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status).json({ message: error.message, url: req.url, method: req.method });
});
server_1.database.getConnection((err, connection) => {
    if (err) {
        console.log(err);
    }
    else {
        connection.release();
        server.listen(port, () => {
            console.log(`Express Server listening on port ${port}`);
            server_1.database.query('SELECT 1', (err, result) => {
                if (err)
                    throw err;
                if (result) {
                    console.log(result);
                }
            });
        });
        console.log('Database Connected Successfully');
    }
});
exports.socketIo.on("connection", (socket) => {
    //console.log(socket.id);
    socket.on("userRegister", (data) => {
        let socketInfo = data;
        let checkUserAvailable = onlineUserDetail.findIndex(val => val.socketID === socketInfo.socketID);
        checkUserAvailable >= 0 ? onlineUserDetail[checkUserAvailable] = socketInfo : onlineUserDetail.push(socketInfo);
        exports.socketIo.emit("onlineUser", onlineUserDetail);
    });
    socket.on("disconnect", () => {
        let findIndex = onlineUserDetail.findIndex(val => val.socketID === socket.id);
        if (findIndex >= 0) {
            if (onlineUserDetail[findIndex].userDetail && onlineUserDetail[findIndex].userDetail.userGUID) {
                server_1.database.query(`insert into loginTracker (trackerGUID, userGUID, trackerType, trackerCreateDate, trackerCreateTime) values (uuid(), "${onlineUserDetail[findIndex].userDetail.userGUID}", "Logout", "${(0, moment_1.default)().format('YYYY-MM-DD')}", "${(0, moment_1.default)().format('HH:mm:ss')}")`, (err, result) => {
                    if (result) {
                        onlineUserDetail.splice(findIndex, 1);
                        exports.socketIo.emit("onlineUser", onlineUserDetail);
                    }
                });
            }
            else {
                onlineUserDetail.splice(findIndex, 1);
                exports.socketIo.emit("onlineUser", onlineUserDetail);
            }
        }
        //console.log(`User Disconnected ${socket.id}`);
    });
});
