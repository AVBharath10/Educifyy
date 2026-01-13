'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/page-layout'
import { useAuth } from '@/lib/useAuth'
import { userApi, Course } from '@/lib/api'
import { Loader2, Plus, BookOpen, Edit, Users, Star, Zap } from 'lucide-react'

export default function TeachPage() {
    const router = useRouter()
    const { user, isAuthenticated, isInitialized } = useAuth()
    const [createdCourses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Wait for auth to initialize before fetching
        if (!isInitialized) return

        const fetchCourses = async () => {
            if (!isAuthenticated || !user) {
                setIsLoading(false)
                return
            }

            try {
                const data = await userApi.getCreatedCourses(user.id)
                setCourses(data || [])
            } catch (error) {
                console.error('Failed to fetch courses:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [isAuthenticated, user, isInitialized])

    // Show loading while initializing
    if (!isInitialized) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
            </PageLayout>
        )
    }

    // Redirect if not logged in (only after initialization)
    if (!isAuthenticated) {
        router.push('/auth/login?redirect=/teach')
        return null
    }

    return (
        <PageLayout>
            <div className="p-6 md:p-12 max-w-7xl mx-auto min-h-[80vh]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-[#EBE8DF] pb-8">
                    <div>
                        <h1 className="text-4xl font-medium tracking-tight text-[#1A1916] mb-2">Instructor Studio</h1>
                        <p className="text-neutral-500 text-lg">Manage your content and create new courses.</p>
                    </div>
                    <Link href="/upload">
                        <button className="px-6 py-3 bg-[#1A1916] text-[#FDFBF7] rounded-xl font-medium hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10">
                            <Plus size={20} /> Create New Course
                        </button>
                    </Link>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loader2 className="animate-spin text-neutral-400 w-8 h-8" />
                    </div>
                ) : createdCourses.length > 0 ? (
                    <div className="grid gap-6">
                        {createdCourses.map((course) => (
                            <div key={course.id} className="bg-white border border-[#EBE8DF] rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:border-neutral-400 transition-colors group">
                                {/* Thumbnail */}
                                <div className="w-full md:w-64 h-40 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                            <BookOpen size={24} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded backdrop-blur-md uppercase tracking-wider font-medium">
                                        {course.status || 'Draft'}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-xl font-medium text-[#1A1916] mb-2">{course.title}</h3>
                                            <Link href={`/upload?edit=${course.id}`}>
                                                <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-black transition-colors" title="Edit Course">
                                                    <Edit size={18} />
                                                </button>
                                            </Link>
                                        </div>
                                        <p className="text-neutral-500 line-clamp-2 max-w-2xl mb-4">
                                            {course.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={16} /> <span>{course.students || 0} students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Star size={16} className="text-yellow-500/80" /> <span>{course.rating || '0.0'} rating</span>
                                        </div>
                                        <Link href={`/course/${course.id}`} className="ml-auto text-black font-medium hover:underline">
                                            View Public Page →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center border-2 border-dashed border-[#EBE8DF] rounded-2xl bg-[#FDFBF7]">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#EBE8DF]">
                            <Zap size={32} className="text-neutral-300" />
                        </div>
                        <h2 className="text-xl font-medium mb-2 text-[#1A1916]">You haven't posted anything yet</h2>
                        <p className="text-neutral-500 max-w-md mx-auto mb-8">
                            Start your teaching journey by creating your first course. It's easy and takes just a few minutes.
                        </p>
                        <Link href="/upload">
                            <button className="px-8 py-3 bg-[#1A1916] text-[#FDFBF7] rounded-xl font-medium hover:bg-neutral-800 transition-all">
                                Create Your First Course
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </PageLayout>
    )
}
