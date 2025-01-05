"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const uploadImage_1 = require("../../middlewares/uploadImage");
const fileUpload_controller_1 = require("../../modules/fileUpload/fileUpload.controller");
const router = express_1.default.Router();
// Upload Image
router.post('/upload-image', uploadImage_1.uploadImage.single('image'), fileUpload_controller_1.uploadImageFile);
// Upload Document (Doc, PDF)
router.post('/upload-doc', uploadImage_1.uploadDoc.single('document'), fileUpload_controller_1.uploadDocumentFile);
exports.fileUploadRoutes = router;
