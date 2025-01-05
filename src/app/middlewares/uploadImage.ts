import multer from 'multer';
import path from 'path';

// Multer configuration for images
const imageStorage = multer.diskStorage({
  destination: './uploadedFiles/image',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit for images
  },
});
// Multer configuration for documents (Doc, PDF)
const docStorage = multer.diskStorage({
  destination: './uploadedFiles/bookFile',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadDoc = multer({
  storage: docStorage,
  fileFilter: (req, file, cb) => {
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .doc, .docx, and .pdf files are allowed!'));
    }
  },
});
