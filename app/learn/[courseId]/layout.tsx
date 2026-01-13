'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CourseSidebar } from '@/components/course-sidebar'
import { courseApi } from '@/lib/api'
import { Loader2, Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const params = useParams()
    const courseId = params?.courseId as string
    const lessonId = params?.lessonId as string

    const [course, setCourse] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return
            try {
                setIsLoading(true)
                const data = await courseApi.getCourse(courseId)
                setCourse(data)
            } catch (err) {
                console.error('Failed to load course:', err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCourse()
    }, [courseId])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <p>Course not found</p>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-80 h-full shrink-0 bg-[#FDFBF7]">
                <CourseSidebar course={course} currentLessonId={lessonId} />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden absolute top-4 left-4 z-50">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <button className="p-2 rounded-lg bg-card border border-border shadow-xs">
                            <Menu size={20} />
                        </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                        <CourseSidebar course={course} currentLessonId={lessonId} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto relative">
                {children}
            </main>
        </div>
    )
}
