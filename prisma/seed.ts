import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Create Instructor
    const password = await hash('password123', 12)
    const instructor = await prisma.user.upsert({
        where: { email: 'instructor@educify.com' },
        update: {},
        create: {
            email: 'instructor@educify.com',
            name: 'Sarah Instructor',
            password,
            role: 'INSTRUCTOR',
            bio: 'Expert instructor with 10 years of experience.',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
    })

    const courses = [
        {
            title: 'Complete Web Development Bootcamp',
            description: 'Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
            category: 'WEB_DEVELOPMENT',
            difficulty: 'BEGINNER',
            price: 0,
            duration: '40h',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.8,
            studentsEnrolled: 1250,
        },
        {
            title: 'Machine Learning A-Z: Hands-On Python',
            description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.',
            category: 'AI_ML',
            difficulty: 'INTERMEDIATE',
            price: 0,
            duration: '25h',
            thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.7,
            studentsEnrolled: 850,
        },
        {
            title: 'Digital Marketing Masterclass',
            description: 'The complete digital marketing course. Social media marketing, SEO, YouTube, Email, Facebook Marketing, Analytics and more!',
            category: 'BUSINESS',
            difficulty: 'BEGINNER',
            price: 0,
            duration: '32h',
            thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.6,
            studentsEnrolled: 2100,
        },
        {
            title: 'Advanced React Patterns',
            description: 'Level up your React skills with advanced patterns, performance optimization, and state management techniques.',
            category: 'WEB_DEVELOPMENT',
            difficulty: 'ADVANCED',
            price: 0,
            duration: '12h',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.9,
            studentsEnrolled: 500,
        },
        {
            title: 'UI/UX Design Fundamentals',
            description: 'Learn how to design beautiful user interfaces and user experiences. Figma, Adobe XD, and design theory.',
            category: 'DESIGN',
            difficulty: 'BEGINNER',
            price: 0,
            duration: '18h',
            thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.7,
            studentsEnrolled: 1500,
        },
        {
            title: 'Python for Data Science and AI',
            description: 'Master Python for Data Science and AI. Learn Pandas, NumPy, Matplotlib, and Scikit-learn.',
            category: 'DATA_SCIENCE',
            difficulty: 'BEGINNER',
            price: 0,
            duration: '22h',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.8,
            studentsEnrolled: 3000,
        },
        {
            title: 'Music Production with Ableton Live',
            description: 'Learn music production from scratch with Ableton Live. Create your own tracks and beats.',
            category: 'MUSIC',
            difficulty: 'INTERMEDIATE',
            price: 0,
            duration: '15h',
            thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.9,
            studentsEnrolled: 450,
        },
        {
            title: 'Photography Masterclass',
            description: 'The best online professional photography class. Learn how to take amazing photos.',
            category: 'DESIGN',
            difficulty: 'BEGINNER',
            price: 0,
            duration: '10h',
            thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            instructorId: instructor.id,
            rating: 4.7,
            studentsEnrolled: 1800,
        }
    ]

    // Clear existing courses to avoid duplicates
    await prisma.course.deleteMany({
        where: { instructorId: instructor.id }
    })

    for (const course of courses) {
        const createdCourse = await prisma.course.create({
            data: {
                ...course,
                modules: {
                    create: [
                        {
                            title: 'Introduction to the Course',
                            type: 'VIDEO',
                            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                            order: 0,
                            duration: '10:00',
                            fileName: 'intro.mp4'
                        },
                        {
                            title: 'Getting Started',
                            type: 'TEXT',
                            content: '# Getting Started\n\nWelcome to the course! Here is what you will learn...',
                            order: 1,
                            duration: '5 min read',
                            fileName: 'guide.md',
                            url: ''
                        },
                        {
                            title: 'Core Concepts',
                            type: 'VIDEO',
                            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                            order: 2,
                            duration: '15:00',
                            fileName: 'concepts.mp4'
                        },
                        {
                            title: 'Advanced Topics',
                            type: 'TEXT',
                            content: '## Advanced Topics\n\nNow we dive deep into the complex parts...',
                            order: 3,
                            duration: '10 min read',
                            fileName: 'advanced.md',
                            url: ''
                        }
                    ]
                }
            },
        })
    }

    console.log(`Seeding finished. Created ${courses.length} courses.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
