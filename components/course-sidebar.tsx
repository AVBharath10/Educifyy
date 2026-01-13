'use client'

import Link from 'next/link'
import { Play, FileText, CheckCircle, Circle, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Module {
    id: string
    title: string
    type: 'VIDEO' | 'DOCUMENT' | 'video' | 'document'
    duration?: string
    isCompleted?: boolean
}

interface CourseSidebarProps {
    course: {
        id: string
        title: string
        modules: Module[]
        progress?: number
    }
    currentLessonId: string
}

export function CourseSidebar({ course, currentLessonId }: CourseSidebarProps) {
    return (
        <div className="flex flex-col h-full border-r border-[#EBE8DF] bg-[#FDFBF7]">
            {/* Header */}
            <div className="p-5 border-b border-[#EBE8DF]">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-black mb-4 transition-colors uppercase tracking-wide"
                >
                    <ChevronLeft size={14} />
                    Back to Dashboard
                </Link>
                <h2 className="font-medium text-lg text-[#1A1916] line-clamp-2 mb-4 leading-tight">{course.title}</h2>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                        <span>{course.progress || 0}% Complete</span>
                        <span>{course.modules.filter(m => m.isCompleted).length}/{course.modules.length}</span>
                    </div>
                    <div className="h-1.5 bg-[#EBE8DF] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#1A1916] transition-all duration-500"
                            style={{ width: `${course.progress || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {course.modules.map((module, index) => {
                    const isActive = module.id === currentLessonId
                    const Icon = module.type.toLowerCase().includes('video') ? Play : FileText

                    return (
                        <Link
                            key={module.id}
                            href={`/learn/${course.id}/${module.id}`}
                            className={cn(
                                "flex items-start gap-3 p-3 rounded-lg transition-all border",
                                isActive
                                    ? "bg-white border-[#EBE8DF] shadow-sm"
                                    : "hover:bg-white hover:border-[#EBE8DF] border-transparent hover:shadow-sm"
                            )}
                        >
                            <div className="mt-0.5">
                                {module.isCompleted ? (
                                    <CheckCircle size={16} className="text-emerald-600" />
                                ) : (
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                                        isActive ? "border-black" : "border-neutral-300"
                                    )}>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium line-clamp-2 mb-1",
                                    isActive ? "text-black" : "text-neutral-600"
                                )}>
                                    {index + 1}. {module.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-neutral-400">
                                    <Icon size={12} />
                                    <span>{module.duration || '5 min'}</span>
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
