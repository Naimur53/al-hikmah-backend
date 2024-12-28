"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
/* eslint-disable @typescript-eslint/no-unused-vars */
const sendEmail = (_a, _b) => __awaiter(void 0, [_a, _b], void 0, function* ({ to, multi }, { subject, html, text }) {
    const transport = yield nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: config_1.default.emailUser,
            pass: config_1.default.emailUserPass,
        },
    });
    console.log('hi');
    // const transport = await nodemailer.createTransport({
    //   host: 'smtp.privateemail.com', // or 'smtp.privateemail.com'
    //   port: 465, // or 465 for SSL or 587
    //   secure: true, // true for 465, false for 587
    //   auth: {
    //     user: config.emailUser,
    //     pass: config.emailUserPass,
    //   },
    //   tls: {
    //     // Enable TLS encryption
    //     ciphers: 'SSLv3',
    //   },
    // });
    // send mail with defined transport object
    const mailOptions = {
        from: config_1.default.emailUser,
        to,
        subject,
        html,
        text,
    };
    // eslint-disable-next-line no-unused-vars
    if (multi === null || multi === void 0 ? void 0 : multi.length) {
        for (const recipient of multi) {
            const mailOptionsPer = {
                from: config_1.default.emailUser,
                to: recipient,
                subject,
                html,
                text,
            };
            try {
                // Send mail for each recipient
                yield transport.sendMail(Object.assign({}, mailOptionsPer));
                // console.log(`Email sent successfully to ${recipient}`);
            }
            catch (error) {
                // console.error(`Error sending email to ${recipient}:`, error);
            }
        }
    }
    else {
        try {
            const res = yield transport.sendMail(Object.assign({}, mailOptions));
            console.log(res);
        }
        catch (err) {
            console.log(err);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sorry sending email is not available this time');
        }
        // console.log('its the main success after send to one email');
    }
});
exports.default = sendEmail;
