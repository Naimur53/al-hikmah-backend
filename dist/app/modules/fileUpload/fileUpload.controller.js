"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocumentFile = exports.uploadImageFile = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const uploadImageFile = (req, res, next) => {
    if (!req.file) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'NO image found');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploadedFiles/image/${req.file.filename}`;
    res
        .status(http_status_1.default.OK)
        .json({ message: 'Image uploaded successfully!', fileUrl });
};
exports.uploadImageFile = uploadImageFile;
const uploadDocumentFile = (req, res, next) => {
    if (!req.file) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No document found');
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploadedFiles/bookFile/${req.file.filename}`;
    res
        .status(http_status_1.default.OK)
        .json({ message: 'Document uploaded successfully!', fileUrl });
};
exports.uploadDocumentFile = uploadDocumentFile;
