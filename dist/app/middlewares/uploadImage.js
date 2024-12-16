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
exports.uploadMulter = void 0;
const http_status_1 = __importDefault(require("http-status"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// cloudinary config
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.uploadMulter = (0, multer_1.default)({
    dest: './uploads/',
    storage,
    limits: {
        fileSize: 4000000,
    },
});
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Image file not found!');
        }
        const file = req.file;
        console.log(file);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        console.log(imageUrl);
        req.body.uploadedImageUrl = imageUrl;
        next();
    }
    catch (e) {
        next(e);
    }
});
exports.default = uploadImage;
