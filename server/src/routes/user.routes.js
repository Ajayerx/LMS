import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import prisma from '../config/prisma.js';

const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                instructor: { select: { name: true } },
              },
            },
          },
        },
        createdCourses: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user enrollments
router.get('/enrollments', verifyToken, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            _count: { select: { chapters: true } },
          },
        },
      },
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
