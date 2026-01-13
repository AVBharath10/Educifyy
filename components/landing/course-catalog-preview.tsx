"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, Loader2, ArrowRight } from "lucide-react"
import Link from "next/link"
import { courseApi } from "@/lib/api"
import { CourseCard } from "@/components/course-card"

export function CourseCatalogPreview() {
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch recommended or popular courses
                // Since we don't have a specific "popular" endpoint, we'll list courses
                // In a real app, this would be `recommendationsApi.getPopular()` or similar
                const response = await courseApi.listCourses({ limit: 4 })
                const coursesData = Array.isArray(response) ? response : (response as any).data || []
                setCourses(coursesData.slice(0, 4))
            } catch (error) {
                console.error("Failed to fetch courses for preview:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCourses()
    }, [])

    return (
        <section className="py-24 border-t border-[#EBE8DF] bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-medium tracking-tight mb-2">
                            Popular Courses
                        </h2>
                        <p className="text-lg text-neutral-500">
                            Master the latest technologies with industry experts.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/catalog">
                            <button className="px-4 py-2 border border-[#EBE8DF] rounded-md text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 transition-all">
                                View All Courses <ArrowRight size={14} />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 overflow-x-auto pb-6 mb-2 custom-scrollbar">
                    <button className="bg-[#1A1916] text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap">
                        All
                    </button>
                    <button className="bg-neutral-100 text-neutral-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-neutral-200 whitespace-nowrap border border-transparent">
                        Web Development
                    </button>
                    <button className="bg-neutral-100 text-neutral-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-neutral-200 whitespace-nowrap border border-transparent">
                        Machine Learning
                    </button>
                    <button className="bg-neutral-100 text-neutral-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-neutral-200 whitespace-nowrap border border-transparent">
                        Product Design
                    </button>
                    <button className="bg-neutral-100 text-neutral-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-neutral-200 whitespace-nowrap border border-transparent">
                        DevOps
                    </button>
                </div>

                {/* Course Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {courses.map(course => (
                            <CourseCard
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                instructor={typeof course.instructor === 'object' ? course.instructor?.name || 'Unknown' : course.instructor || 'Unknown'}
                                category={course.category}
                                difficulty={course.difficulty || 'Beginner'}
                                rating={course.rating || 0}
                                students={course.studentsEnrolled || 0}
                                duration={course.duration || '0h'}
                                thumbnail={course.thumbnail}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-neutral-50 rounded-lg border border-dashed border-[#EBE8DF]">
                        <p className="text-neutral-500">No courses available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    )
}
