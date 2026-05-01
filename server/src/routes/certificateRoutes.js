import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  getCertificateById,
  verifyCertificate
} from '../controllers/certificateController.js';
import { verifyToken, isStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public verification endpoint
router.get('/verify/:certificateId', verifyCertificate);

// Protected routes
router.use(verifyToken);

// Generate certificate (Student - requires 100% progress)
router.post('/:courseId', isStudent, generateCertificate);

// Get my certificates
router.get('/my-certificates', getMyCertificates);

// Get specific certificate
router.get('/:id', getCertificateById);

export default router;
