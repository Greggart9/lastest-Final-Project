import express from 'express';
import {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getColleges,
  addCollege,
  updateCollege,
  deleteCollege,
  addDepartment,
  updateDepartment,
  setCollegeLevels,
  deleteDepartment,
} from '../controllers/academicController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = express.Router();

// Universities
router.get(['/admin/universities', '/universities'], getUniversities);
router.get('/admin/universities/:id', getUniversityById);
router.post('/admin/universities', optionalAuth, createUniversity);
router.put('/admin/universities/:id', optionalAuth, updateUniversity);
router.delete('/admin/universities/:id', optionalAuth, deleteUniversity);

// Colleges & Faculties
router.get('/academic/colleges', getColleges);
router.post('/admin/colleges', optionalAuth, addCollege);
router.put('/admin/colleges/:id', optionalAuth, updateCollege);
router.delete('/admin/colleges/:id', optionalAuth, deleteCollege);
router.put('/admin/colleges/:code/levels', optionalAuth, setCollegeLevels);

// Departments
router.post('/admin/departments', optionalAuth, addDepartment);
router.put('/admin/departments/:id', optionalAuth, updateDepartment);
router.delete('/admin/departments/:id', optionalAuth, deleteDepartment);

export default router;
