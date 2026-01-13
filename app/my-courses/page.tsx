'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/page-layout'
import { CourseCard } from '@/components/course-card'
import { useAuth } from '@/lib/useAuth'
import { userApi, Enrollment } from '@/lib/api'
import { Loader2, Search, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function MyCoursesPage() {
    const { user, isAuthenticated } = useAuth()
    const [enrollments, setEnrollments] = useState<Enrollment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!isAuthenticated || !user?.id) {
                setIsLoading(false)
                return
            }
            try {
                setIsLoading(true)
                const data = await userApi.getDashboard(user.id)
                if (data && data.enrolledCourses) {
                    setEnrollments(data.enrolledCourses)
                }
            } catch (err) {
                console.error('Failed to fetch enrollments:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchEnrollments()
    }, [user?.id, isAuthenticated])

    const filteredEnrollments = enrollments.filter(e =>
        e.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return (
            <PageLayout>
                <div className="flex h-full items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EBE8DF] pb-8">
                    <div>
                        <h1 className="text-3xl font-medium tracking-tight mb-2">My Courses</h1>
                        <p className="text-neutral-500">Continue where you left off</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Filter courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-[#EBE8DF] rounded-lg text-sm w-64 focus:outline-none focus:border-black transition-colors bg-white"
                        />
                    </div>
                </div>

                {filteredEnrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEnrollments.map((enrollment) => (
                            // Reuse CourseCard but map enrollment data to it or create a specific EnrolledCourseCard if needed. 
                            // For now, using CourseCard and passing progress if supported or just the course data.
                            // The existing CourseCard might not show progress, so let's stick to a custom card here for "My Courses" which usually needs progress bars.
                            <Link href={`/course/${enrollment.course.id}`} key={enrollment.id}>
                                <div className="group flex flex-col h-full bg-white border border-[#EBE8DF] rounded-xl overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer">
                                    <div className="relative h-48 bg-neutral-100 overflow-hidden">
                                        {enrollment.course.thumbnail ? (
                                            <img src={enrollment.course.thumbnail} alt={enrollment.course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-300">
                                                <BookOpen className="w-8 h-8" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-neutral-200">
                                            <div className="h-full bg-black" style={{ width: `${enrollment.progress}%` }} />
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                                                {enrollment.course.category}
                                            </span>
                                            <span className="text-xs text-neutral-500 font-medium">{enrollment.progress}% Complete</span>
                                        </div>
                                        <h3 className="font-medium text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{enrollment.course.title}</h3>
                                        <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-1">{enrollment.course.description}</p>

                                        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                                            <span>Last accessed: {enrollment.lastAccessed ? new Date(enrollment.lastAccessed).toLocaleDateString() : 'Never'}</span>
                                            <span className="font-medium text-black">Continue</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#EBE8DF]">
                        <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-6 h-6 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No courses found</h3>
                        <p className="text-neutral-500 mb-6">You haven't enrolled in any courses yet.</p>
                        <Link href="/catalog">
                            <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                                Browse Catalog
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </PageLayout>
    )
}
