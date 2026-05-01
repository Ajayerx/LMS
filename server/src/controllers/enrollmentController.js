import prisma from '../config/prisma.js';
import { createNotification } from './notificationController.js';

// Enroll in a course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if course exists and is approved
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in a course that is not approved'
      });
    }

    // Prevent instructor from enrolling in their own course
    if (course.instructorId === studentId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot enroll in your own course'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        progress: 0,
        enrolledAt: new Date()
      },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true }
            },
            _count: {
              select: { chapters: true }
            }
          }
        }
      }
    });

    // Create notification for instructor
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { name: true }
    });

    await createNotification(
      enrollment.course.instructorId,
      `New student "${student.name}" enrolled in your course "${enrollment.course.title}"`,
      'INFO'
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      enrollment
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// Get student's enrolled courses with progress
export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true, email: true }
            },
            _count: {
              select: { chapters: true }
            }
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      }
    });

    // Enhance with watched chapters count
    const enrollmentsWithDetails = await Promise.all(
      enrollments.map(async (enrollment) => {
        const watchedChapters = await prisma.chapterProgress.count({
          where: {
            studentId,
            chapter: {
              courseId: enrollment.courseId
            },
            watched: true
          }
        });

        const totalChapters = enrollment.course._count.chapters;
        const calculatedProgress = totalChapters > 0
          ? Math.round((watchedChapters / totalChapters) * 100)
          : 0;

        return {
          ...enrollment,
          stats: {
            totalChapters,
            watchedChapters,
            progress: calculatedProgress,
            remainingChapters: totalChapters - watchedChapters
          }
        };
      })
    );

    res.json({
      success: true,
      count: enrollments.length,
      enrollments: enrollmentsWithDetails
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

// Unenroll from a course
export const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Delete enrollment (cascade will delete progress records)
    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    res.json({
      success: true,
      message: 'Successfully unenrolled from the course'
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unenrolling from course',
      error: error.message
    });
  }
};

// Get enrollment details for a specific course
export const getEnrollmentByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true }
            },
            _count: {
              select: { chapters: true }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Get watched chapters count
    const watchedChapters = await prisma.chapterProgress.count({
      where: {
        studentId,
        chapter: {
          courseId
        },
        watched: true
      }
    });

    const totalChapters = enrollment.course._count.chapters;

    res.json({
      success: true,
      enrollment: {
        ...enrollment,
        stats: {
          totalChapters,
          watchedChapters,
          progress: Math.round((watchedChapters / totalChapters) * 100) || 0,
          remainingChapters: totalChapters - watchedChapters
        }
      }
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment details',
      error: error.message
    });
  }
};
