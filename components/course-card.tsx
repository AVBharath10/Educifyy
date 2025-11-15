'use client'

import Link from 'next/link'
import { Star, Users, Clock } from 'lucide-react'

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
  rating,
  students,
  duration,
  thumbnail,
}: CourseCardProps) {
  return (
    <Link href={`/course/${id}`}>
      <div className="group h-full rounded-lg border border-border bg-card overflow-hidden hover-glow transition-all cursor-pointer">
        {/* Thumbnail */}
        <div className="relative h-40 w-full bg-gradient-purple-blue overflow-hidden">
          {thumbnail ? (
            <img src={thumbnail || "/placeholder.svg"} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-3xl opacity-30">📚</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">{category}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-secondary/20 text-secondary font-medium">{difficulty}</span>
          </div>

          <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground mb-3">{instructor}</p>

          <div className="flex items-center gap-3 pt-3 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-accent text-accent" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{students}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
