import express from 'express';
import {
  uploadMaterial,
  getUserSubmissions,
  getApprovedMaterials,
} from '../controllers/materialController.js';
import { optionalAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/upload', optionalAuth, upload.single('file'), uploadMaterial);
router.get('/submissions', optionalAuth, getUserSubmissions);
router.get('/', getApprovedMaterials);

export default router;
