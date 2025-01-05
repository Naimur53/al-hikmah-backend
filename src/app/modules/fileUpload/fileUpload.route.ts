import express from 'express';
import { uploadDoc, uploadImage } from '../../middlewares/uploadImage';
import {
  uploadDocumentFile,
  uploadImageFile,
} from '../../modules/fileUpload/fileUpload.controller';

const router = express.Router();

// Upload Image
router.post('/upload-image', uploadImage.single('image'), uploadImageFile);

// Upload Document (Doc, PDF)
router.post('/upload-doc', uploadDoc.single('document'), uploadDocumentFile);

export const fileUploadRoutes = router;
