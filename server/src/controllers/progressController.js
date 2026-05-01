import prisma from '../config/prisma.js';

// Helper function to recalculate course progress
const recalculateCourseProgress = async (studentId, courseId) => {
  // Get total chapters for the course
  const totalChapters = await prisma.chapter.count({
    where: { courseId }
  });

  if (totalChapters === 0) return 0;

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

  // Calculate progress percentage
  const progress = Math.round((watchedChapters / totalChapters) * 100);

  // Update enrollment progress
  await prisma.enrollment.update({
    where: {
      studentId_courseId: {
        studentId,
        courseId
      }
    },
    data: {
      progress
    }
  });

  return progress;
};

// Mark chapter as watched
export const markChapterAsWatched = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const studentId = req.user.id;

    // Find the chapter and its course
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Check if student is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: chapter.courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to track progress'
      });
    }

    // Create or update chapter progress
    const chapterProgress = await prisma.chapterProgress.upsert({
      where: {
        studentId_chapterId: {
          studentId,
          chapterId
        }
      },
      update: {
        watched: true,
        watchedAt: new Date()
      },
      create: {
        studentId,
        chapterId,
        watched: true,
        watchedAt: new Date()
      }
    });

    // Recalculate and update course progress
    const updatedProgress = await recalculateCourseProgress(studentId, chapter.courseId);

    // Check if course is completed
    const totalChapters = await prisma.chapter.count({
      where: { courseId: chapter.courseId }
    });

    const watchedChapters = await prisma.chapterProgress.count({
      where: {
        studentId,
        chapter: {
          courseId: chapter.courseId
        },
        watched: true
      }
    });

    const isCompleted = watchedChapters === totalChapters && totalChapters > 0;

    res.json({
      success: true,
      message: 'Chapter marked as watched',
      chapterProgress,
      courseProgress: {
        totalChapters,
        watchedChapters,
        percentage: updatedProgress,
        isCompleted
      }
    });
  } catch (error) {
    console.error('Mark watched error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chapter progress',
      error: error.message
    });
  }
};

// Mark chapter as unwatched
export const markChapterAsUnwatched = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const studentId = req.user.id;

    // Find the chapter
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        course: true
      }
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Update chapter progress
    const chapterProgress = await prisma.chapterProgress.update({
      where: {
        studentId_chapterId: {
          studentId,
          chapterId
        }
      },
      data: {
        watched: false,
        watchedAt: null
      }
    });

    // Recalculate course progress
    const updatedProgress = await recalculateCourseProgress(studentId, chapter.courseId);

    res.json({
      success: true,
      message: 'Chapter marked as unwatched',
      chapterProgress,
      courseProgress: {
        percentage: updatedProgress
      }
    });
  } catch (error) {
    console.error('Mark unwatched error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating chapter progress',
      error: error.message
    });
  }
};

// Get chapter-wise progress for a course
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Get all chapters for the course with progress
    const chapters = await prisma.chapter.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
        duration: true
      }
    });

    // Get progress for each chapter
    const chaptersWithProgress = await Promise.all(
      chapters.map(async (chapter) => {
        const progress = await prisma.chapterProgress.findFirst({
          where: {
            studentId,
            chapterId: chapter.id
          }
        });

        return {
          ...chapter,
          progress: progress || {
            watched: false,
            watchedAt: null
          }
        };
      })
    );

    // Calculate overall stats
    const totalChapters = chapters.length;
    const watchedChapters = await prisma.chapterProgress.count({
      where: {
        studentId,
        chapter: {
          courseId
        },
        watched: true
      }
    });

    const isCompleted = watchedChapters === totalChapters && totalChapters > 0;

    res.json({
      success: true,
      courseId,
      enrollment: {
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress
      },
      stats: {
        totalChapters,
        watchedChapters,
        remainingChapters: totalChapters - watchedChapters,
        percentage: Math.round((watchedChapters / totalChapters) * 100) || 0,
        isCompleted
      },
      chapters: chaptersWithProgress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course progress',
      error: error.message
    });
  }
};

// Get overall learning stats for student
export const getLearningStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get total enrollments
    const totalEnrollments = await prisma.enrollment.count({
      where: { studentId }
    });

    // Get completed courses (100% progress)
    const completedCourses = await prisma.enrollment.count({
      where: {
        studentId,
        progress: 100
      }
    });

    // Get total chapters watched across all courses
    const totalChaptersWatched = await prisma.chapterProgress.count({
      where: {
        studentId,
        watched: true
      }
    });

    // Get average progress
    const avgProgress = await prisma.enrollment.aggregate({
      where: { studentId },
      _avg: {
        progress: true
      }
    });

    // Get certificates earned
    const certificates = await prisma.certificate.count({
      where: { studentId }
    });

    // Get total learning time (sum of watched chapter durations)
    const watchedChapters = await prisma.chapterProgress.findMany({
      where: {
        studentId,
        watched: true
      },
      include: {
        chapter: {
          select: {
            duration: true
          }
        }
      }
    });

    const totalLearningTime = watchedChapters.reduce((sum, wp) => {
      return sum + (wp.chapter.duration || 0);
    }, 0);

    res.json({
      success: true,
      stats: {
        totalEnrollments,
        completedCourses,
        inProgressCourses: totalEnrollments - completedCourses,
        totalChaptersWatched,
        averageProgress: Math.round(avgProgress._avg.progress || 0),
        certificatesEarned: certificates,
        totalLearningTimeMinutes: Math.round(totalLearningTime / 60),
        totalLearningTimeHours: Math.round(totalLearningTime / 3600 * 10) / 10
      }
    });
  } catch (error) {
    console.error('Get learning stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching learning stats',
      error: error.message
    });
  }
};
