import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Hash passwords
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  const instructorPassword = await bcrypt.hash(process.env.INSTRUCTOR_PASSWORD || 'instructor123', 10);
  const studentPassword = await bcrypt.hash(process.env.STUDENT1_PASSWORD || 'student123', 10);
  const student2Password = await bcrypt.hash(process.env.STUDENT2_PASSWORD || 'student123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@lms.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@lms.com',
      name: 'System Administrator',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true
    }
  });
  console.log('Created admin user:', admin.email);

  // Create Instructor User
  const instructor = await prisma.user.upsert({
    where: { email: process.env.INSTRUCTOR_EMAIL || 'instructor@lms.com' },
    update: {},
    create: {
      email: process.env.INSTRUCTOR_EMAIL || 'instructor@lms.com',
      name: 'Jane Instructor',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      isActive: true
    }
  });
  console.log('Created instructor user:', instructor.email);

  // Create Student Users
  const student1 = await prisma.user.upsert({
    where: { email: process.env.STUDENT1_EMAIL || 'student1@lms.com' },
    update: {},
    create: {
      email: process.env.STUDENT1_EMAIL || 'student1@lms.com',
      name: 'John Student',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true
    }
  });
  console.log('Created student 1:', student1.email);

  const student2 = await prisma.user.upsert({
    where: { email: process.env.STUDENT2_EMAIL || 'student2@lms.com' },
    update: {},
    create: {
      email: process.env.STUDENT2_EMAIL || 'student2@lms.com',
      name: 'Alice Student',
      password: student2Password,
      role: 'STUDENT',
      isActive: true
    }
  });
  console.log('Created student 2:', student2.email);

  // Create Sample Course 1 - Web Development
  const course1 = await prisma.course.upsert({
    where: { id: 'course-1-sample' },
    update: {},
    create: {
      id: 'course-1-sample',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive web development course. Perfect for beginners looking to start their journey in web development.',
      price: 49.99,
      status: 'APPROVED',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      instructorId: instructor.id
    }
  });
  console.log('Created course 1:', course1.title);

  // Create Chapters for Course 1
  const chapters1 = [
    { title: 'Introduction to Web Development', order: 0, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 600 },
    { title: 'HTML5 Basics', order: 1, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 900 },
    { title: 'CSS3 Styling', order: 2, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1200 },
    { title: 'JavaScript Fundamentals', order: 3, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1800 },
    { title: 'React Introduction', order: 4, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1500 }
  ];

  for (const chapter of chapters1) {
    await prisma.chapter.upsert({
      where: { id: `chapter-1-${chapter.order}` },
      update: {},
      create: {
        id: `chapter-1-${chapter.order}`,
        title: chapter.title,
        order: chapter.order,
        videoUrl: chapter.videoUrl,
        duration: chapter.duration,
        courseId: course1.id
      }
    });
  }
  console.log('Created 5 chapters for course 1');

  // Create Sample Course 2 - Data Science
  const course2 = await prisma.course.upsert({
    where: { id: 'course-2-sample' },
    update: {},
    create: {
      id: 'course-2-sample',
      title: 'Data Science Fundamentals',
      description: 'Master the basics of data science with Python. Learn data analysis, visualization, machine learning basics, and statistical concepts.',
      price: 59.99,
      status: 'APPROVED',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      instructorId: instructor.id
    }
  });
  console.log('Created course 2:', course2.title);

  // Create Chapters for Course 2
  const chapters2 = [
    { title: 'Introduction to Data Science', order: 0, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 450 },
    { title: 'Python for Data Science', order: 1, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1200 },
    { title: 'Data Analysis with Pandas', order: 2, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1500 },
    { title: 'Data Visualization', order: 3, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 900 },
    { title: 'Introduction to Machine Learning', order: 4, videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4', duration: 1800 }
  ];

  for (const chapter of chapters2) {
    await prisma.chapter.upsert({
      where: { id: `chapter-2-${chapter.order}` },
      update: {},
      create: {
        id: `chapter-2-${chapter.order}`,
        title: chapter.title,
        order: chapter.order,
        videoUrl: chapter.videoUrl,
        duration: chapter.duration,
        courseId: course2.id
      }
    });
  }
  console.log('Created 5 chapters for course 2');

  // Create Sample Pending Course (for admin to approve)
  const pendingCourse = await prisma.course.upsert({
    where: { id: 'course-pending-sample' },
    update: {},
    create: {
      id: 'course-pending-sample',
      title: 'Mobile App Development with React Native',
      description: 'Build cross-platform mobile applications using React Native. Learn navigation, state management, and deployment.',
      price: 69.99,
      status: 'PENDING',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
      instructorId: instructor.id
    }
  });
  console.log('Created pending course:', pendingCourse.title);

  // Create Enrollment for Student 1 in Course 1
  const enrollment1 = await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: student1.id,
        courseId: course1.id
      }
    },
    update: {},
    create: {
      studentId: student1.id,
      courseId: course1.id,
      progress: 40
    }
  });
  console.log('Created enrollment for student 1 in course 1');

  // Create some progress records for Student 1
  await prisma.chapterProgress.upsert({
    where: { 
      studentId_chapterId: {
        studentId: student1.id,
        chapterId: 'chapter-1-0'
      }
    },
    update: {},
    create: {
      studentId: student1.id,
      chapterId: 'chapter-1-0',
      watched: true,
      watchedAt: new Date()
    }
  });

  await prisma.chapterProgress.upsert({
    where: { 
      studentId_chapterId: {
        studentId: student1.id,
        chapterId: 'chapter-1-1'
      }
    },
    update: {},
    create: {
      studentId: student1.id,
      chapterId: 'chapter-1-1',
      watched: true,
      watchedAt: new Date()
    }
  });
  console.log('Created progress records for student 1');

  // Create Sample Quiz for Course 1
  const quiz1 = await prisma.quiz.upsert({
    where: { id: 'quiz-1-sample' },
    update: {},
    create: {
      id: 'quiz-1-sample',
      title: 'Web Development Basics Quiz',
      courseId: course1.id
    }
  });
  console.log('Created quiz for course 1');

  // Create Questions for Quiz 1
  const questions = [
    {
      questionText: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'],
      correctAnswer: '0'
    },
    {
      questionText: 'Which tag is used to create a hyperlink in HTML?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswer: '1'
    },
    {
      questionText: 'What is the correct CSS syntax to change the text color?',
      options: ['text-color: red;', 'color: red;', 'font-color: red;', 'text: red;'],
      correctAnswer: '1'
    }
  ];

  for (let i = 0; i < questions.length; i++) {
    await prisma.question.upsert({
      where: { id: `question-1-${i}` },
      update: {},
      create: {
        id: `question-1-${i}`,
        questionText: questions[i].questionText,
        options: questions[i].options,
        correctAnswer: questions[i].correctAnswer,
        quizId: quiz1.id
      }
    });
  }
  console.log('Created 3 questions for quiz 1');

  // Create Sample Certificate for Student 1
  await prisma.certificate.upsert({
    where: { 
      studentId_courseId: {
        studentId: student1.id,
        courseId: course2.id
      }
    },
    update: {},
    create: {
      id: 'cert-1-sample',
      studentId: student1.id,
      courseId: course2.id,
      issuedAt: new Date(),
      certificateUrl: '/certificates/sample-cert.pdf'
    }
  });
  console.log('Created sample certificate for student 1');

  // Create Sample Notifications
  await prisma.notification.createMany({
    skipDuplicates: true,
    data: [
      {
        userId: student1.id,
        message: 'Welcome to the LMS! Start exploring courses today.',
        isRead: false
      },
      {
        userId: student1.id,
        message: 'You have been enrolled in "Complete Web Development Bootcamp"',
        isRead: true
      },
      {
        userId: instructor.id,
        message: 'Your course "Complete Web Development Bootcamp" has been approved!',
        isRead: false
      },
      {
        userId: instructor.id,
        message: 'New student enrolled in your course.',
        isRead: true
      }
    ]
  });
  console.log('Created sample notifications');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\nDefault Login Credentials:');
  console.log('Admin: admin@lms.com / admin123');
  console.log('Instructor: instructor@lms.com / instructor123');
  console.log('Student 1: student1@lms.com / student123');
  console.log('Student 2: student2@lms.com / student123');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
