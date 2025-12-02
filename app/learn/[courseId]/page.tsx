'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { courseApi } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function LearnCoursePage() {
  const router = useRouter()
  const params = useParams()
  const courseId = params?.courseId as string
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirectToFirstLesson = async () => {
      try {
        const course = await courseApi.getCourse(courseId)
        
        // Find the first lesson
        let firstLessonId = null
        
        // Check modules first
        if (course.modules && course.modules.length > 0) {
           // Assuming modules have lessons or are lessons themselves. 
           // Based on schema, Module is a type of content. 
           // Let's look at the schema again. 
           // Module has type VIDEO/DOCUMENT. So a Module IS a lesson essentially in this simplified schema?
           // Wait, schema has Module AND Lesson. 
           // Module has `courseId`. Lesson has `courseId` and `moduleId`.
           // So Lessons belong to Modules.
           
           // Let's check if there are lessons.
           if (course.lessons && course.lessons.length > 0) {
             // Sort by order
             const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order)
             firstLessonId = sortedLessons[0].id
           } else if (course.modules && course.modules.length > 0) {
             // Fallback to module if it acts as a lesson (some implementations do this)
             // But schema says Module has `url` and `type`. So Module might be the content unit?
             // Let's check schema again.
             // Module: id, title, type, url, fileName.
             // Lesson: id, title, content, moduleId.
             // It seems slightly ambiguous. The Upload page creates "Modules" with type video/document.
             // So "Modules" in the Upload page are actually the content units.
             // Let's assume we redirect to the first "Module" (which acts as a lesson).
             
             const sortedModules = [...course.modules].sort((a, b) => a.order - b.order)
             firstLessonId = sortedModules[0].id
           }
        }

        if (firstLessonId) {
          router.replace(`/learn/${courseId}/${firstLessonId}`)
        } else {
          setError('No lessons found in this course.')
        }
      } catch (err) {
        console.error('Failed to load course:', err)
        setError('Failed to load course. Please try again.')
      }
    }

    if (courseId) {
      redirectToFirstLesson()
    }
  }, [courseId, router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}
