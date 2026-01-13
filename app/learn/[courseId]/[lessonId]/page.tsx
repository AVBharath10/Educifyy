'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courseApi, enrollmentApi, userApi } from '@/lib/api'
import { VideoPlayer } from '@/components/video-player'
import { Loader2, FileText, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export default function LessonPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const courseId = params?.courseId as string
    const lessonId = params?.lessonId as string

    const [course, setCourse] = useState<any>(null)
    const [lesson, setLesson] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    // XP / Time Tracking State
    const [accumulatedTime, setAccumulatedTime] = useState(0) // in seconds
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const totalHoursRef = useRef<number>(0)
    const [isSavingProgress, setIsSavingProgress] = useState(false)

    // Load User Profile for XP base
    useEffect(() => {
        if (!user?.id) return
        const loadProfile = async () => {
            try {
                const profile = await userApi.getProfile(user.id)
                if (profile) {
                    totalHoursRef.current = profile.totalHours || 0
                }
            } catch (e) {
                console.error("Failed to load user profile for XP tracking", e)
            }
        }
        loadProfile()
    }, [user?.id])

    // Tracking Timer
    useEffect(() => {
        // Clear existing interval
        if (intervalRef.current) clearInterval(intervalRef.current)

        // Only track if loaded
        if (isLoading || error) return

        intervalRef.current = setInterval(() => {
            setAccumulatedTime(prev => {
                const newTime = prev + 1
                // Every 60 seconds, save progress
                if (newTime % 60 === 0) {
                    saveXP()
                }
                return newTime
            })
        }, 1000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [isLoading, error])

    const saveXP = async () => {
        if (!user?.id) return
        try {
            // Update ref
            const hoursToAdd = 1 / 60
            totalHoursRef.current += hoursToAdd

            // Send to backend
            // We use the ref value to ensure we are incrementing correctly from known state
            await userApi.updateProfile(user.id, {
                totalHours: totalHoursRef.current
            })
            console.log('XP Updated: +1 min')
        } catch (e) {
            console.error('Failed to save XP:', e)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!courseId || !lessonId) return
            try {
                setIsLoading(true)
                setError(null)

                const courseData = await courseApi.getCourse(courseId)
                setCourse(courseData)

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

            if (course && course.modules) {
                const currentIndex = course.modules.findIndex((m: any) => m.id === lessonId)
                const nextLesson = course.modules[currentIndex + 1]

                if (nextLesson) {
                    router.push(`/learn/${courseId}/${nextLesson.id}`)
                } else {
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
        <div className="max-w-5xl mx-auto p-6 md:p-10">
            {/* Video Player or Content Viewer */}
            <div className="mb-10">
                {lesson.type?.toLowerCase() === 'video' ? (
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-[#EBE8DF] bg-black aspect-video relative group">
                        {lesson.url ? (
                            <VideoPlayer
                                url={lesson.url}
                                poster={course.thumbnail}
                                onEnded={() => setIsCompleted(true)}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 bg-neutral-900">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-medium">Video content unavailable</p>
                                <p className="text-sm opacity-60 mt-2">The instructor hasn't uploaded a video for this lesson yet.</p>
                            </div>
                        )}
                    </div>
                ) : lesson.type?.toLowerCase() === 'text' ? (
                    <div className="bg-white border border-[#EBE8DF] rounded-2xl p-8 md:p-12 shadow-sm">
                        <div className="prose max-w-none text-[#1A1916]">
                            <div className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
                                {lesson.content || lesson.description || "No content available for this lesson."}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="aspect-video bg-white border border-[#EBE8DF] rounded-2xl flex flex-col items-center justify-center p-8 text-center shadow-sm bg-pattern relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

                        <div className="w-20 h-20 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 border border-[#EBE8DF] shadow-sm relative z-10">
                            <FileText className="w-10 h-10 text-neutral-400" />
                        </div>
                        <h3 className="text-2xl font-medium mb-3 text-[#1A1916] relative z-10">{lesson.title}</h3>
                        <p className="text-neutral-500 mb-8 max-w-md relative z-10">
                            This is a document lesson. Please read the attached materials to complete this module.
                        </p>
                        {lesson.url ? (
                            <a
                                href={lesson.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-[#1A1916] text-[#FDFBF7] rounded-lg hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all font-medium shadow-lg shadow-black/20 relative z-10"
                            >
                                Open Document
                            </a>
                        ) : (
                            <button disabled className="px-8 py-3 bg-neutral-100 text-neutral-400 rounded-lg cursor-not-allowed font-medium relative z-10">
                                No Document Attached
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between border-b border-[#EBE8DF] pb-8 mb-10">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight mb-3 text-[#1A1916]">{lesson.title}</h1>
                    <p className="text-neutral-500 font-medium text-sm uppercase tracking-wide">
                        Module {course.modules.findIndex((m: any) => m.id === lessonId) + 1} of {course.modules.length}
                    </p>
                    {/* XP Indicator */}
                    <div className="mt-2 text-xs font-mono text-neutral-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Earning XP (1 XP/min)
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleComplete}
                        className={`group flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${isCompleted
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-[#1A1916] text-[#FDFBF7] hover:bg-neutral-800 shadow-md"
                            }`}
                    >
                        {isCompleted ? (
                            <>
                                <CheckCircle size={18} className="mr-1" />
                                Completed
                            </>
                        ) : (
                            <>
                                Mark as Complete
                                <ChevronRight size={18} className="ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="prose max-w-none prose-headings:font-medium prose-headings:text-[#1A1916] prose-p:text-neutral-600">
                <h3 className="text-xl mb-4">Lesson Notes</h3>
                <p className="leading-relaxed text-lg text-neutral-600">
                    {lesson.description || "No notes available for this lesson."}
                </p>
            </div>
        </div>
    )
}
