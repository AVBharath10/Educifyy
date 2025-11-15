const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create test instructor
  const instructorPassword = await bcrypt.hash("instructor123", 10);
  const instructor = await prisma.user.create({
    data: {
      email: "instructor@educify.com",
      password: instructorPassword,
      name: "Alex Turner",
      role: "INSTRUCTOR",
      isVerified: true,
      bio: "Full-stack developer with 10+ years of experience building scalable web applications",
      location: "San Francisco, CA",
      joinDate: new Date("2024-01-15"),
    },
  });

  console.log("✅ Created instructor:", instructor.email);

  // Create test student 1
  const student1Password = await bcrypt.hash("student123", 10);
  const student1 = await prisma.user.create({
    data: {
      email: "student1@educify.com",
      password: student1Password,
      name: "Sarah Chen",
      role: "STUDENT",
      isVerified: true,
      bio: "Data science enthusiast learning new technologies",
      location: "New York, NY",
      joinDate: new Date("2024-02-10"),
    },
  });

  console.log("✅ Created student 1:", student1.email);

  // Create test student 2
  const student2Password = await bcrypt.hash("student456", 10);
  const student2 = await prisma.user.create({
    data: {
      email: "student2@educify.com",
      password: student2Password,
      name: "Jordan Smith",
      role: "STUDENT",
      isVerified: true,
      bio: "Web developer exploring advanced React patterns",
      location: "Austin, TX",
      joinDate: new Date("2024-03-05"),
    },
  });

  console.log("✅ Created student 2:", student2.email);

  // Create Course 1: Advanced React Patterns (with ID "1" for testing)
  const course1 = await prisma.course.create({
    data: {
      id: "1", // Fixed ID for testing/catalog
      title: "Advanced React Patterns and Performance Optimization",
      description:
        "Master advanced React patterns and learn how to build high-performance applications. This comprehensive course covers everything from hooks and context to code splitting and lazy loading. Perfect for developers looking to level up their skills.",
      category: "WEB_DEVELOPMENT",
      difficulty: "ADVANCED",
      price: 99.99,
      instructorId: instructor.id,
      rating: 4.9,
      studentsEnrolled: 2543,
      duration: "12 weeks",
      highlights: [
        "Advanced React Patterns",
        "Performance Optimization",
        "State Management Best Practices",
        "Testing Strategies",
        "Real-world Projects",
      ],
      requirements: [
        "Solid understanding of React basics",
        "ES6+ JavaScript knowledge",
        "Familiarity with React hooks",
        "Node.js and npm installed",
      ],
      whatYouLearn: [
        "Master advanced React patterns like render props and compound components",
        "Optimize React applications for peak performance",
        "Implement professional state management solutions",
        "Write testable React code with best practices",
        "Build production-ready applications",
      ],
      status: "PUBLISHED",
    },
  });

  console.log("✅ Created course 1:", course1.title);

  // Create modules for Course 1
  const course1Modules = [
    {
      title: "Introduction to Advanced Patterns",
      type: "VIDEO",
      url: "https://example.com/videos/intro-patterns.mp4",
      fileName: "intro-patterns.mp4",
      duration: "45 min",
      order: 1,
    },
    {
      title: "Custom Hooks and Composition",
      type: "VIDEO",
      url: "https://example.com/videos/custom-hooks.mp4",
      fileName: "custom-hooks.mp4",
      duration: "60 min",
      order: 2,
    },
    {
      title: "Context API Deep Dive",
      type: "VIDEO",
      url: "https://example.com/videos/context-api.mp4",
      fileName: "context-api.mp4",
      duration: "50 min",
      order: 3,
    },
    {
      title: "Performance Profiling",
      type: "DOCUMENT",
      url: "https://example.com/docs/performance-guide.pdf",
      fileName: "performance-guide.pdf",
      duration: "10 pages",
      order: 4,
    },
  ];

  for (const moduleData of course1Modules) {
    await prisma.module.create({
      data: {
        courseId: course1.id,
        ...moduleData,
      },
    });
  }

  console.log("✅ Created 4 modules for course 1");

  // Create lessons for Course 1
  const course1Lessons = [
    {
      title: "Introduction to Advanced Patterns",
      duration: "45 min",
      order: 1,
      content: "Learn about render props and compound components",
      moduleId: null,
    },
    {
      title: "Custom Hooks and Composition",
      duration: "60 min",
      order: 2,
      content: "Build reusable custom hooks",
      moduleId: null,
    },
    {
      title: "Context API Deep Dive",
      duration: "50 min",
      order: 3,
      content: "Master Context API for state management",
      moduleId: null,
    },
    {
      title: "Performance Profiling",
      duration: "55 min",
      order: 4,
      content: "Use React DevTools for performance optimization",
      moduleId: null,
    },
    {
      title: "Code Splitting and Lazy Loading",
      duration: "65 min",
      order: 5,
      content: "Implement route-based code splitting",
      moduleId: null,
    },
    {
      title: "State Management Solutions",
      duration: "70 min",
      order: 6,
      content: "Compare Redux, Zustand, and other state managers",
      moduleId: null,
    },
    {
      title: "Testing React Components",
      duration: "60 min",
      order: 7,
      content: "Write unit and integration tests with Vitest and React Testing Library",
      moduleId: null,
    },
    {
      title: "Real-world Project: Building a Dashboard",
      duration: "120 min",
      order: 8,
      content: "Build a complete dashboard application",
      moduleId: null,
    },
  ];

  for (const lessonData of course1Lessons) {
    await prisma.lesson.create({
      data: {
        courseId: course1.id,
        ...lessonData,
      },
    });
  }

  console.log("✅ Created 8 lessons for course 1");

  // Create Course 2: Machine Learning Fundamentals
  const course2 = await prisma.course.create({
    data: {
      title: "Machine Learning Fundamentals with Python",
      description:
        "Learn the fundamentals of machine learning with Python. This course covers supervised and unsupervised learning, model evaluation, and practical implementations using popular libraries like scikit-learn and TensorFlow.",
      category: "DATA_SCIENCE",
      difficulty: "INTERMEDIATE",
      price: 79.99,
      instructorId: instructor.id,
      rating: 4.8,
      studentsEnrolled: 3201,
      duration: "10 weeks",
      highlights: [
        "Supervised Learning",
        "Unsupervised Learning",
        "Model Evaluation",
        "Feature Engineering",
        "Real Datasets",
      ],
      requirements: [
        "Python programming knowledge",
        "Basic statistics understanding",
        "Jupyter Notebook experience",
        "Pandas and NumPy familiarity",
      ],
      whatYouLearn: [
        "Understand machine learning fundamentals and algorithms",
        "Build and train machine learning models",
        "Evaluate and optimize model performance",
        "Work with real-world datasets",
        "Deploy machine learning models",
      ],
      status: "PUBLISHED",
    },
  });

  console.log("✅ Created course 2:", course2.title);

  // Create modules for Course 2
  const course2Modules = [
    {
      title: "Introduction to ML",
      type: "VIDEO",
      url: "https://example.com/videos/ml-intro.mp4",
      fileName: "ml-intro.mp4",
      duration: "40 min",
      order: 1,
    },
    {
      title: "Linear Regression",
      type: "VIDEO",
      url: "https://example.com/videos/linear-regression.mp4",
      fileName: "linear-regression.mp4",
      duration: "55 min",
      order: 2,
    },
    {
      title: "Classification Algorithms",
      type: "VIDEO",
      url: "https://example.com/videos/classification.mp4",
      fileName: "classification.mp4",
      duration: "65 min",
      order: 3,
    },
    {
      title: "ML Guide",
      type: "DOCUMENT",
      url: "https://example.com/docs/ml-guide.pdf",
      fileName: "ml-guide.pdf",
      duration: "50 pages",
      order: 4,
    },
  ];

  for (const moduleData of course2Modules) {
    await prisma.module.create({
      data: {
        courseId: course2.id,
        ...moduleData,
      },
    });
  }

  console.log("✅ Created 4 modules for course 2");

  // Create lessons for Course 2
  const course2Lessons = [
    {
      title: "What is Machine Learning?",
      duration: "40 min",
      order: 1,
      content: "Understanding ML concepts and types",
    },
    {
      title: "Linear Regression Basics",
      duration: "55 min",
      order: 2,
      content: "Build your first regression model",
    },
    {
      title: "Classification Fundamentals",
      duration: "65 min",
      order: 3,
      content: "Learn classification algorithms",
    },
    {
      title: "Feature Engineering",
      duration: "50 min",
      order: 4,
      content: "Prepare data for better models",
    },
    {
      title: "Model Evaluation",
      duration: "60 min",
      order: 5,
      content: "Measure model performance",
    },
  ];

  for (const lessonData of course2Lessons) {
    await prisma.lesson.create({
      data: {
        courseId: course2.id,
        ...lessonData,
      },
    });
  }

  console.log("✅ Created 5 lessons for course 2");

  // Create enrollments
  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      progress: 65,
      enrolledAt: new Date("2024-08-10"),
      lastAccessed: new Date(),
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
      progress: 85,
      enrolledAt: new Date("2024-07-20"),
      lastAccessed: new Date("2024-11-14"),
      status: "COMPLETED",
      completedAt: new Date("2024-11-13"),
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: student2.id,
      courseId: course1.id,
      progress: 40,
      enrolledAt: new Date("2024-09-01"),
      lastAccessed: new Date(),
    },
  });

  console.log("✅ Created enrollments");

  // Create wishlist entries
  await prisma.wishlist.create({
    data: {
      userId: student2.id,
      courseId: course2.id,
    },
  });

  console.log("✅ Created wishlist entries");

  // Create reviews
  await prisma.review.create({
    data: {
      userId: student1.id,
      courseId: course1.id,
      rating: 5,
      review:
        "Excellent course! Learned so much about advanced React patterns. Highly recommended!",
    },
  });

  await prisma.review.create({
    data: {
      userId: student1.id,
      courseId: course2.id,
      rating: 5,
      review: "Outstanding ML course! The instructor explains concepts very clearly.",
    },
  });

  console.log("✅ Created reviews");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
