"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDoc = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Multer configuration for images
const imageStorage = multer_1.default.diskStorage({
    destination: './uploadedFiles/image',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 4 * 1024 * 1024, // 4MB limit for images
    },
});
// Multer configuration for documents (Doc, PDF)
const docStorage = multer_1.default.diskStorage({
    destination: './uploadedFiles/bookFile',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.uploadDoc = (0, multer_1.default)({
    storage: docStorage,
    fileFilter: (req, file, cb) => {
        const allowedDocTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only .doc, .docx, and .pdf files are allowed!'));
        }
    },
});
