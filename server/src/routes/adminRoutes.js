import express from 'express';
import {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  createUser,
} from '../controllers/adminController.js';
import {
  adminUploadMaterial,
  getAdminSubmissions,
  getSubmissionDetails,
  reviewSubmission,
  updateSubmissionMetadata,
  deleteSubmission,
} from '../controllers/materialController.js';
import { optionalAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// Analytics & Metrics
router.get('/stats', optionalAuth, getStats);

// User Directory
router.get('/users', optionalAuth, getUsers);
router.post('/users', optionalAuth, createUser);
router.put('/users/:id/role', optionalAuth, updateUserRole);
router.delete('/users/:id', optionalAuth, deleteUser);

// Material Submissions Management
router.post('/materials/upload', optionalAuth, upload.single('file'), adminUploadMaterial);
router.get('/submissions', optionalAuth, getAdminSubmissions);
router.get('/submissions/:id', optionalAuth, getSubmissionDetails);
router.put('/submissions/:id/review', optionalAuth, reviewSubmission);
router.put('/submissions/:id', optionalAuth, updateSubmissionMetadata);
router.delete('/submissions/:id', optionalAuth, deleteSubmission);

export default router;
