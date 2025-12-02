'use client'

import Link from 'next/link'
import { Star, Users, Clock } from 'lucide-react'
import { ConfirmationModal } from '@/components/confirmation-modal'

interface CourseCardProps {
  id: string
  title: string
  instructor: string
  category: string
  difficulty: string
  rating: number
  students: number
  duration: string
  thumbnail?: string
}

export function CourseCard({
  id,
  title,
  instructor,
  category,
  difficulty,
  duration,
  thumbnail,
  onDelete,
  onEdit,
}: CourseCardProps & { onDelete?: (id: string) => void; onEdit?: (id: string) => void }) {
  return (
    <div className="group relative h-full rounded-2xl border border-border/50 bg-card overflow-hidden hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/course/${id}`} className="flex-1 flex flex-col">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-secondary/20 to-primary/10">
              <div className="text-5xl opacity-20 grayscale">🎓</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-lg">
              {category.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 gap-4">
          <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary-foreground">
              {(instructor && instructor !== 'Unknown' ? instructor[0] : 'E')}
            </div>
            <span className="font-medium">{instructor === 'Unknown' ? 'Educify Instructor' : instructor}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary/70" />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons (Overlay) */}
      {(onDelete || onEdit) && (
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 flex gap-2">
          {onEdit && (
            <button
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md shadow-lg transition-colors"
              title="Edit Course"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(id)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
          )}

          {onDelete && (
            <ConfirmationModal
              title="Delete Course?"
              description="Are you sure you want to delete this course? This action cannot be undone and will remove all videos and enrollments."
              confirmText="Delete Course"
              variant="destructive"
              onConfirm={async () => onDelete(id)}
              trigger={
                <button
                  className="p-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-md shadow-lg transition-colors"
                  title="Delete Course"
                  onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              }
            />
          )}
        </div>
      )}
    </div>
  )
}
