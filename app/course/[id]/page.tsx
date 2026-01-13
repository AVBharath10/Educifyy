'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, Users, Clock, BookOpen, Play, Check, Share2, Heart, Loader2, AlertCircle, ChevronLeft, Sparkles, Shield } from 'lucide-react'
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
      {/* Header Section */}
      <div className="relative bg-[#FDFBF7] border-b border-[#EBE8DF] bg-pattern">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <Link
            href="/catalog"
            className="text-neutral-500 hover:text-black font-medium mb-6 inline-flex items-center gap-2 transition-colors text-sm uppercase tracking-wide"
          >
            <ChevronLeft size={16} />
            Back to Catalog
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-medium mb-6 text-[#1A1916] leading-tight tracking-tight">{course.title}</h1>
            <div className="flex flex-wrap gap-6 items-center text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100 text-yellow-700">
                <Star size={16} className="fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{course.rating || '0'}</span>
                <span className="text-yellow-600/80">({course.studentsEnrolled || 0} enrolled)</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Clock size={18} />
                <span>{course.duration || 'N/A'}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-neutral-100/80 border border-neutral-200 text-neutral-700 text-xs font-semibold uppercase tracking-wide">
                {course.difficulty || 'Unknown'}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1A1916]/5 border border-[#1A1916]/10 text-[#1A1916] text-xs font-semibold uppercase tracking-wide">
                {course.category || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button for Instructor */}
        {isAuthenticated && user?.id === course.instructorId && (
          <div className="absolute top-8 right-8">
            <Link href={`/course/${course.id}/edit`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#EBE8DF] hover:bg-neutral-50 transition-all font-medium text-[#1A1916] shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Edit Course
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Description */}
            <section>
              <h2 className="text-2xl font-medium mb-6 text-[#1A1916]">About this course</h2>
              <p className="text-neutral-600 leading-relaxed text-lg mb-8">{course.description || 'No description available'}</p>

              {/* Highlights */}
              {course.highlights && course.highlights.length > 0 && (
                <div className="bg-[#FDFBF7] border border-[#EBE8DF] rounded-2xl p-8">
                  <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    What you'll learn
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 relative shrink-0">
                          <Check size={14} className="text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <span className="text-neutral-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <section>
                <h2 className="text-2xl font-medium mb-6 text-[#1A1916]">Requirements</h2>
                <ul className="space-y-4">
                  {course.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-neutral-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Instructor Info */}
            <section>
              <h2 className="text-2xl font-medium mb-6 text-[#1A1916]">Your instructor</h2>
              <div className="flex items-start gap-6 p-6 rounded-2xl bg-white border border-[#EBE8DF] shadow-sm">
                {instructor.avatar ? (
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full object-cover shrink-0 border border-[#EBE8DF]"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#1A1916] text-[#FDFBF7] flex items-center justify-center shrink-0 text-2xl font-medium">
                    {instructor.name ? instructor.name.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-xl text-[#1A1916] mb-2">{instructor.name}</h3>
                  <p className="text-neutral-500 leading-relaxed mb-4">{instructor.bio || 'Experienced instructor passionate about teaching.'}</p>
                  <button className="text-sm font-medium underline underline-offset-4 decoration-neutral-300 hover:decoration-black transition-all">View full profile</button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Enrollment Card */}
            <div className="p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm space-y-6 sticky top-24">
              <div className="text-center mb-6">
                {/* Price removed as per user request */}
              </div>

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

              {/* Guarantee removed */}

              <div className="pt-6 border-t border-[#EBE8DF] space-y-4 text-sm text-neutral-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-black">
                    <BookOpen size={16} />
                  </div>
                  <span>{course.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-black">
                    <Clock size={16} />
                  </div>
                  <span>{course.duration || 'N/A'} duration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-black">
                    <Users size={16} />
                  </div>
                  <span>{course.studentsEnrolled || 0} students enrolled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-black">
                    <Shield size={16} />
                  </div>
                  <span>Certificate of completion</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#EBE8DF]">
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#FDFBF7] hover:bg-neutral-100 border border-[#EBE8DF] transition-colors font-medium text-sm text-neutral-700">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
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
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors font-medium text-sm ${isWishlisted
                    ? 'bg-red-50 border-red-100 text-red-600'
                    : 'bg-[#FDFBF7] hover:bg-neutral-100 border-[#EBE8DF] text-neutral-700'
                    }`}
                >
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                  <span>{isWishlisted ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
