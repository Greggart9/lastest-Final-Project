import multer from 'multer';

// Multer in-memory storage upload middleware for PDFs and academic documents
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit
});
