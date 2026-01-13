"use client"

import { useState, useEffect } from "react"
import {
    PlayCircle,
    Lock,
    FileText,
    Play,
    Volume2,
    Maximize,
    Star,
    Paperclip,
    Check,
    ArrowRight,
    Loader2
} from "lucide-react"
import { courseApi } from "@/lib/api"

export function PlatformPreview() {
    const [featuredCourse, setFeaturedCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Determine 'featured' by rating or enrolled students in a real app
                // Here we just pick the first one
                const response = await courseApi.listCourses({ limit: 1 })
                const courses = Array.isArray(response) ? response : (response as any).data || []
                if (courses.length > 0) {
                    setFeaturedCourse(courses[0])
                }
            } catch (error) {
                console.error("Failed to fetch featured course:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchFeatured()
    }, [])

    const courseTitle = featuredCourse?.title || "Introduction to App Router"
    const instructorName = typeof featuredCourse?.instructor === 'object' ? featuredCourse.instructor.name : (featuredCourse?.instructor || "Alex D.")
    const moduleName = featuredCourse?.modules?.[0]?.title || "Foundations & Setup"
    const lessonName = featuredCourse?.modules?.[0]?.id ? `1.1 ${featuredCourse.modules[0].title}` : "1.1 Introduction"

    // Simulate other lessons based on the first one or generic
    const lessons = featuredCourse?.modules?.slice(0, 3).map((m: any, i: number) => ({
        title: `${i + 1}.1 ${m.title}`,
        duration: "10 min",
        type: "video"
    })) || [
            { title: "1.1 Introduction", duration: "5 min", type: "video" },
            { title: "1.2 Project Structure", duration: "12 min", type: "video" },
            { title: "1.3 Config Guide", duration: "Read", type: "text" }
        ]

    if (isLoading) return null // Or a skeleton, but for a landing section easier to just wait or show default

    return (
        <>
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                        A World-Class Learning Environment
                    </h2>
                    <p className="text-xl text-neutral-500">
                        Built for focus. Designed for retention.
                    </p>
                </div>

                {/* UI Mockup Container */}
                <div className="relative bg-neutral-900 rounded-xl p-2 md:p-4 shadow-2xl border border-neutral-800">
                    {/* Window Controls */}
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 bg-neutral-800 px-3 py-1 rounded text-xs text-neutral-400 font-mono w-64 text-center truncate">
                            educify.io/learn/{featuredCourse?.id || 'nextjs-arch'}
                        </div>
                    </div>

                    {/* Layout Grid (Simulating /learn/[courseId]) */}
                    <div className="grid lg:grid-cols-4 gap-0 bg-[#FDFBF7] rounded-lg overflow-hidden h-[600px] border border-neutral-800">
                        {/* Sidebar (Curriculum) */}
                        <div className="hidden lg:flex flex-col border-r border-[#EBE8DF] bg-white h-full">
                            <div className="p-4 border-b border-[#EBE8DF]">
                                <h5 className="font-medium text-sm text-neutral-500 uppercase tracking-widest mb-1">
                                    Module 1
                                </h5>
                                <p className="font-medium text-base truncate">{moduleName}</p>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {lessons.map((lesson: any, i: number) => (
                                    <div key={i} className={`flex items-center gap-3 p-4 ${i === 0 ? 'bg-neutral-50 border-l-2 border-black' : 'hover:bg-neutral-50 border-l-2 border-transparent'} cursor-pointer group`}>
                                        {lesson.type === 'video' ? (
                                            <PlayCircle className={`w-5 h-5 ${i === 0 ? 'text-black' : 'text-neutral-400 group-hover:text-black'}`} />
                                        ) : (
                                            <FileText className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                                        )}
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${i === 0 ? 'text-black' : 'text-neutral-600 group-hover:text-black'}`}>
                                                {lesson.title}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-0.5">{lesson.duration}</p>
                                        </div>
                                    </div>
                                ))}
                                {!featuredCourse && (
                                    <div className="flex items-center gap-3 p-4 hover:bg-neutral-50 border-l-2 border-transparent cursor-pointer group">
                                        <Lock className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-neutral-600 group-hover:text-black">
                                                Mock Module
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-0.5">LOCKED</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content (Video Player) */}
                        <div className="lg:col-span-3 flex flex-col h-full bg-[#FDFBF7]">
                            <div className="bg-black aspect-video w-full flex items-center justify-center relative group">
                                {/* Custom Video UI Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                    <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer overflow-hidden">
                                        <div className="w-1/3 h-full bg-[#FFF848]"></div>
                                    </div>
                                    <div className="flex items-center justify-between text-white">
                                        <div className="flex items-center gap-4">
                                            <Play className="w-5 h-5 fill-white" />
                                            <Volume2 className="w-5 h-5" />
                                            <span className="text-sm font-mono">04:20 / 12:45</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-mono border border-white/30 px-2 py-0.5 rounded">
                                                HD
                                            </span>
                                            <Maximize className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <Play className="w-16 h-16 text-white/90 fill-white/90 opacity-80" />
                            </div>

                            {/* Tabs & Content */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex border-b border-[#EBE8DF]">
                                    <button className="px-6 py-4 text-sm font-medium border-b-2 border-black">
                                        Overview
                                    </button>
                                    <button className="px-6 py-4 text-sm font-medium text-neutral-500 hover:text-black">
                                        Q&A
                                    </button>
                                    <button className="px-6 py-4 text-sm font-medium text-neutral-500 hover:text-black">
                                        Notes
                                    </button>
                                </div>
                                <div className="p-8 overflow-y-auto">
                                    <h1 className="text-2xl font-medium tracking-tight mb-2">
                                        {courseTitle}
                                    </h1>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-neutral-200 border border-[#EBE8DF] flex items-center justify-center text-xs font-bold">
                                                {instructorName[0]}
                                            </div>
                                            <span className="text-sm font-medium text-neutral-700">
                                                {instructorName}
                                            </span>
                                        </div>
                                        <span className="text-neutral-300">|</span>
                                        <div className="flex text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-lg text-neutral-600 leading-relaxed max-w-3xl line-clamp-3">
                                        {featuredCourse?.description || "In this lesson, we will explore the fundamental shifts in Next.js 13+. We'll cover server components, client boundaries, and how the new routing system simplifies data fetching patterns."}
                                    </p>

                                    <div className="mt-8 p-4 bg-neutral-100 border border-neutral-200 rounded-lg">
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Paperclip className="w-4 h-4" /> Resources
                                        </h4>
                                        <ul className="space-y-2">
                                            <li>
                                                <a href="#" className="text-blue-600 hover:underline text-sm">
                                                    Download Source Code.zip
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Student Dashboard Preview (Smaller Section) */}
            <section className="bg-white py-24 border-t border-[#EBE8DF]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-medium tracking-tight mb-4">
                                Track your progress
                            </h2>
                            <p className="text-lg text-neutral-500 mb-8">
                                Stay motivated with daily streaks, detailed analytics, and a
                                personalized learning dashboard. Resume exactly where you left
                                off.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Streak Protection</h4>
                                        <p className="text-neutral-500">
                                            Don&apos;t lose your progress on busy days.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium">Certification Hub</h4>
                                        <p className="text-neutral-500">
                                            Directly export certificates to LinkedIn.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Dashboard Card Mockup */}
                        <div className="md:w-1/2 w-full">
                            <div className="bg-[#FDFBF7] border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-medium">My Learning</h3>
                                    <button className="text-sm text-neutral-500 hover:text-black">
                                        View All
                                    </button>
                                </div>

                                {/* Progress Item */}
                                <div className="bg-white p-4 rounded-lg border border-[#EBE8DF] mb-4 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-medium">
                                                {courseTitle}
                                            </h4>
                                            <p className="text-sm text-neutral-500">
                                                Module 3: Server Actions
                                            </p>
                                        </div>
                                        <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                                            75%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#1A1916] w-3/4"></div>
                                    </div>
                                    <div className="mt-3 flex justify-end">
                                        <button className="text-xs font-medium text-black flex items-center gap-1 hover:underline">
                                            Resume <ArrowRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
