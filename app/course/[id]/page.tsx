'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, Users, Clock, BookOpen, Play, Check, Share2, Heart, Loader2, AlertCircle } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { AnimatedButton } from '@/components/animated-button'
import { EnrollButton } from '@/components/enroll-button'
import { useAuth } from '@/lib/useAuth'
import { courseApi } from '@/lib/api'
import { ApiError } from '@/lib/api'

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params?.id as string
  const { user, isAuthenticated, isInitialized } = useAuth()
  const [courseData, setCourseData] = useState<any>(null)
  const [isLoadingCourse, setIsLoadingCourse] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setIsLoadingCourse(false)
        return
      }
      try {
        setIsLoadingCourse(true)
        setError(null)
        const data = await courseApi.getCourse(courseId)
        setCourseData(data)

        if (isAuthenticated && user?.id) {
          try {
            // Check enrollment
            const enrollmentData = await import('@/lib/api').then(m => m.enrollmentApi.checkEnrollment(courseId))
            setIsEnrolled(enrollmentData.enrolled)

            // Check wishlist
            const wishlistData = await import('@/lib/api').then(m => m.wishlistApi.checkInWishlist(courseId))
            setIsWishlisted(wishlistData.inWishlist)
          } catch (e) {
            console.error('Failed to check status:', e)
          }
        }
      } catch (err: any) {
        // Improved logging for ApiError
        if (err instanceof ApiError) {
          console.error('Failed to fetch course:', err.status, err.message, err.data)
          setError(err.message || 'Failed to load course details')
        } else {
          console.error('Failed to fetch course:', err)
          setError(err?.message || String(err) || 'Failed to load course details')
        }
      } finally {
        setIsLoadingCourse(false)
      }
    }
    fetchCourse()
  }, [courseId, isAuthenticated, user?.id])

  if (!isInitialized) {
    return (
      <PageLayout showTopBar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </PageLayout>
    )
  }

  if (isLoadingCourse) {
    return (
      <PageLayout showTopBar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error || !courseData) {
    return (
      <PageLayout showTopBar={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'Could not load course details'}</p>
            <Link href="/catalog" className="text-primary hover:text-primary/80 font-medium">
              ← Back to Catalog
            </Link>
          </div>
        </div>
      </PageLayout>
    )
  }

  const course = courseData
  const instructor = course.instructor || { name: 'Unknown Instructor' }

  return (
    <PageLayout showTopBar={false}>
      <div className="bg-gradient-purple-blue border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <Link
            href="/catalog"
            className="text-primary hover:text-primary/80 font-medium mb-4 inline-flex items-center gap-2"
          >
            ← Back to Catalog
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm md:text-base">
            <div className="flex items-center gap-1">
              <Star size={18} className="fill-accent text-accent" />
              <span className="font-semibold">{course.rating || '0'}</span>
              <span className="text-muted-foreground">({course.studentsEnrolled || 0} students)</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={18} />
              <span>{course.duration || 'N/A'}</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              {course.difficulty || 'Unknown'}
            </span>
            <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-semibold">
              {course.category || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4">About this course</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{course.description || 'No description available'}</p>

              {/* Highlights */}
              {course.highlights && course.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">What you'll learn</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                        <Check size={20} className="text-primary shrink-0 mt-0.5" />
                        <span className="font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Instructor Info */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Your instructor</h2>
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border">
                <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">{instructor.name}</h3>
                  <p className="text-muted-foreground text-sm">{instructor.bio || 'Experienced instructor'}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="p-6 rounded-lg border border-border bg-card space-y-4">

              {isAuthenticated && isInitialized ? (
                isEnrolled ? (
                  <Link href={`/learn/${courseId}`}>
                    <AnimatedButton className="w-full">
                      Continue Learning
                    </AnimatedButton>
                  </Link>
                ) : (
                  <EnrollButton
                    courseId={courseId}
                    onEnrollSuccess={() => setIsEnrolled(true)}
                  />
                )
              ) : (
                <Link href="/auth/login" className="block w-full">
                  <AnimatedButton className="w-full">
                    Sign in to Enroll
                  </AnimatedButton>
                </Link>
              )}

              <div className="pt-4 border-t border-border space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  <span>{course.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <span>{course.duration || 'N/A'} duration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <span>{course.studentsEnrolled || 0} students enrolled</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-card hover:bg-muted border border-border transition-colors">
                  <Share2 size={18} />
                  <span className="text-sm">Share</span>
                </button>
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      // Redirect to login or show toast
                      return
                    }
                    try {
                      if (isWishlisted) {
                        await import('@/lib/api').then(m => m.wishlistApi.removeFromWishlist(courseId))
                        setIsWishlisted(false)
                      } else {
                        await import('@/lib/api').then(m => m.wishlistApi.addToWishlist(courseId))
                        setIsWishlisted(true)
                      }
                    } catch (e) {
                      console.error('Failed to toggle wishlist:', e)
                    }
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${isWishlisted
                    ? 'bg-red-100 border-red-300 text-red-600'
                    : 'bg-card hover:bg-muted border-border'
                    }`}
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                  <span className="text-sm">{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Course Features */}
            <div className="p-6 rounded-lg border border-border bg-card space-y-3">
              <h3 className="font-semibold">Course features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(course.features || ['Lifetime access', 'Certificate of completion', 'Money-back guarantee']).map(
                  (feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={16} className="text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
