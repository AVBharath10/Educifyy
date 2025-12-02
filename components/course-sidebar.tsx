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
        <div className="flex flex-col h-full border-r border-border bg-card/50">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors"
                >
                    <ChevronLeft size={16} />
                    Back to Dashboard
                </Link>
                <h2 className="font-bold line-clamp-2 mb-2">{course.title}</h2>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{course.progress || 0}% Complete</span>
                        <span>{course.modules.filter(m => m.isCompleted).length}/{course.modules.length}</span>
                    </div>
                    <div className="h-1.5 bg-secondary/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${course.progress || 0}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
                                    ? "bg-primary/10 border-primary/20"
                                    : "hover:bg-accent/10 border-transparent hover:border-border"
                            )}
                        >
                            <div className="mt-0.5">
                                {module.isCompleted ? (
                                    <CheckCircle size={16} className="text-green-500" />
                                ) : (
                                    <div className={cn(
                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                                        isActive ? "border-primary" : "border-muted-foreground"
                                    )}>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium line-clamp-2 mb-1",
                                    isActive ? "text-primary" : "text-foreground"
                                )}>
                                    {index + 1}. {module.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
