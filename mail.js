"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const option = {
    host: "mail.kriyababajiyogasangam.org",
    port: 465,
    secure: true,
    auth: {
        user: `${process.env.MAILUSER}`,
        pass: `${process.env.MAILPASSOWRD}`
    },
    tls: {
        servername: "kriyababajiyogasangam.org"
    }
};
exports.mail = nodemailer_1.default.createTransport(option);
