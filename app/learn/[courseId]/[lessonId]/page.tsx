'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courseApi, enrollmentApi } from '@/lib/api'
import { VideoPlayer } from '@/components/video-player'
import { Loader2, FileText, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import { AnimatedButton } from '@/components/animated-button'

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params?.courseId as string
    const lessonId = params?.lessonId as string

    const [course, setCourse] = useState<any>(null)
    const [lesson, setLesson] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId || !lessonId) return
            try {
                setIsLoading(true)
                setError(null)

                // Fetch course data
                // In a real app, we might have a specific endpoint for just the lesson
                // but here we get the whole course to find the lesson and next/prev links
                const courseData = await courseApi.getCourse(courseId)
                setCourse(courseData)

                // Find the lesson (module)
                const foundLesson = courseData.modules?.find((m: any) => m.id === lessonId)

                if (foundLesson) {
                    setLesson(foundLesson)
                    setIsCompleted(foundLesson.isCompleted || false)
                } else {
                    setError('Lesson not found')
                }
            } catch (err) {
                console.error('Failed to load lesson:', err)
                setError('Failed to load lesson content')
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [courseId, lessonId])

    const handleComplete = async () => {
        try {
            await enrollmentApi.updateProgress(courseId, lessonId)
            setIsCompleted(true)

            // Find next lesson
            if (course && course.modules) {
                const currentIndex = course.modules.findIndex((m: any) => m.id === lessonId)
                const nextLesson = course.modules[currentIndex + 1]

                if (nextLesson) {
                    router.push(`/learn/${courseId}/${nextLesson.id}`)
                } else {
                    // Course completed!
                    alert('Course Completed! Congratulations!')
                    router.push('/dashboard')
                }
            }
        } catch (err) {
            console.error('Failed to update progress:', err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2">Error Loading Lesson</h2>
                <p className="text-muted-foreground mb-4">{error || 'Lesson not found'}</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="text-primary hover:underline"
                >
                    Back to Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Video Player or Content Viewer */}
            <div className="mb-8">
                {lesson.type?.toLowerCase() === 'video' ? (
                    <VideoPlayer
                        url={lesson.url || ''}
                        poster={course.thumbnail}
                        onEnded={() => setIsCompleted(true)}
                    />
                ) : lesson.type?.toLowerCase() === 'text' ? (
                    <div className="bg-card border border-border rounded-xl p-8 md:p-12 shadow-sm">
                        <div className="prose dark:prose-invert max-w-none">
                            {/* In a real app, use a Markdown renderer here */}
                            <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
                                {lesson.content || lesson.description || "No content available."}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video bg-card border border-border rounded-xl flex flex-col items-center justify-center p-8 text-center">
                        <FileText className="w-16 h-16 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                        <p className="text-muted-foreground mb-6">
                            This is a document lesson. Please read the attached materials.
                        </p>
                        {lesson.url && (
                            <a
                                href={lesson.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Open Document
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border pb-8 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{lesson.title}</h1>
                    <p className="text-muted-foreground">
                        Module {course.modules.findIndex((m: any) => m.id === lessonId) + 1} of {course.modules.length}
                    </p>
                </div>

                <div className="flex gap-4">
                    <AnimatedButton
                        onClick={handleComplete}
                        variant={isCompleted ? "outline" : "primary"}
                        className={isCompleted ? "border-green-500 text-green-600 hover:bg-green-50" : ""}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle size={18} className="mr-2" />
                                Completed
                            </>
                        ) : (
                            <>
                                Mark as Complete
                                <ChevronRight size={18} className="ml-2" />
                            </>
                        )}
                    </AnimatedButton>
                </div>
            </div>

            {/* Description / Notes */}
            <div className="prose dark:prose-invert max-w-none">
                <h3>Lesson Notes</h3>
                <p>
                    {lesson.description || "No notes available for this lesson."}
                </p>
            </div>
        </div>
    )
}
