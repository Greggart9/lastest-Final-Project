import express from 'express';
import {
  signup,
  signin,
  getMe,
  updateProfile,
  requestPasswordOtp,
  resetPassword,
} from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.post('/request-password-otp', requestPasswordOtp);
router.post('/reset-password', resetPassword);

export default router;
