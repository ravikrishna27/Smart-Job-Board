import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import AppError from '../utils/AppError.js';

const uploadPath = path.join(process.cwd(), 'uploads', 'resumes');

// Ensure upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Setup local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
// File filter for PDF only and MIME type check
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only PDF resumes are allowed.', 400), false);
  }
};

// Configure Multer with limits
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Wrapper middleware to normalize Multer errors
export const uploadResume = (req, res, next) => {
  const uploadSingle = upload.single('resume');
  
  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Normalize Multer-specific errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('Resume must be under 5MB', 400));
      }
      return next(new AppError(err.message, 400));
    } else if (err) {
      // Unknown errors or AppErrors from fileFilter
      return next(err);
    }
    // Everything went fine
    next();
  });
};
