import prisma from '../config/prisma.js';
import { createNotification } from './notificationController.js';

// Create a new course (Instructor only)
export const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, price } = req.body;
    const instructorId = req.user.id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Course title is required'
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        price: price ? parseFloat(price) : 0,
        status: 'PENDING', // Default status
        instructorId,
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { chapters: true, enrollments: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully. Awaiting admin approval.',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// Get all approved courses (Public)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: 'APPROVED'
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            chapters: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// Get single course by ID with chapters
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        chapters: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            videoUrl: true,
            duration: true,
            order: true
          }
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            _count: { select: { questions: true } }
          }
        },
        _count: {
          select: {
            enrollments: true,
            chapters: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only show approved courses to public, but allow instructor/admin to see their own
    if (course.status !== 'APPROVED') {
      const user = req.user;
      const isOwner = user && course.instructorId === user.id;
      const isAdmin = user && user.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Get course by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// Update course (Instructor - own courses only)
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, price } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find course first
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership (only owner or admin can update)
    const isOwner = existingCourse.instructorId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own courses.'
      });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        thumbnail,
        price: price !== undefined ? parseFloat(price) : undefined
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { chapters: true, enrollments: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// Delete course (Instructor - own courses only)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find course first
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    const isOwner = existingCourse.instructorId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own courses.'
      });
    }

    await prisma.course.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// Approve or reject course (Admin only)
export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either APPROVED or REJECTED'
      });
    }

    const course = await prisma.course.update({
      where: { id },
      data: { status },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Create notification for instructor
    const message = status === 'APPROVED'
      ? `Your course "${course.title}" has been approved and is now live!`
      : `Your course "${course.title}" has been rejected. Please review and resubmit.`;

    await createNotification(course.instructorId, message, status === 'APPROVED' ? 'SUCCESS' : 'WARNING');

    res.json({
      success: true,
      message: `Course ${status.toLowerCase()} successfully`,
      course
    });
  } catch (error) {
    console.error('Approve course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course status',
      error: error.message
    });
  }
};

// Get instructor's own courses
export const getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await prisma.course.findMany({
      where: {
        instructorId
      },
      include: {
        _count: {
          select: {
            chapters: true,
            enrollments: true,
            quizzes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get stats for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const totalStudents = await prisma.enrollment.count({
          where: { courseId: course.id }
        });

        const avgProgress = await prisma.enrollment.aggregate({
          where: { courseId: course.id },
          _avg: { progress: true }
        });

        return {
          ...course,
          stats: {
            totalStudents,
            averageProgress: avgProgress._avg.progress || 0
          }
        };
      })
    );

    res.json({
      success: true,
      count: courses.length,
      courses: coursesWithStats
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor courses',
      error: error.message
    });
  }
};
