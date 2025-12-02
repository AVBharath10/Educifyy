'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Clock, CheckCircle, BookOpen, TrendingUp, Download, Settings, Loader2 } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { CourseCard } from '@/components/course-card'
import { AnimatedButton } from '@/components/animated-button'
import { ConfirmationModal } from '@/components/confirmation-modal'
import Link from 'next/link'
import { useAuth } from '@/lib/useAuth'
import { userApi, DashboardData, Enrollment, Course } from '@/lib/api'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  bg: string
}

function StatCard({ icon, label, value, bg }: StatCardProps) {
  return (
    <div className="p-6 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
      <p className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/60">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [createdCourses, setCreatedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'learning' | 'teaching'>('learning')

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Parallel fetch
        const [dashData, createdData] = await Promise.all([
          userApi.getDashboard(user.id),
          userApi.getCreatedCourses(user.id).catch(() => []) // Fail gracefully for created courses
        ])

        setDashboardData(dashData)
        setCreatedCourses(createdData)
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id, isAuthenticated])

  // Set up real-time enrollment listener
  useEffect(() => {
    const onEnrollmentCreated = (e: Event) => {
      try {
        const customEvent = e as CustomEvent
        const payload = customEvent?.detail
        if (!payload) return

        setDashboardData((prev) => {
          if (!prev) return prev
          // Check if enrollment already exists
          const exists = prev.enrolledCourses.find((c) => c.id === payload.id)
          if (exists) return prev

          // Add new enrollment and increment stats
          return {
            ...prev,
            enrolledCourses: [payload, ...prev.enrolledCourses],
            stats: {
              ...prev.stats,
              activeCourses: prev.stats.activeCourses + 1,
            },
          }
        })
      } catch (err) {
        console.error('Failed to apply enrollment event:', err)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('enrollment:created', onEnrollmentCreated)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('enrollment:created', onEnrollmentCreated)
      }
    }
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="p-4 md:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Use dashboard data or empty defaults
  const stats = dashboardData?.stats || {
    activeCourses: 0,
    totalHours: 0,
    completedCourses: 0,
    currentStreak: 0,
  }

  const enrolledCourses = dashboardData?.enrolledCourses || []
  const recommendedCourses = dashboardData?.recommendedCourses || []

  return (
    <PageLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>

          <div className="flex p-1 bg-muted/50 rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('learning')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'learning'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Learning
            </button>
            <button
              onClick={() => setActiveTab('teaching')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'teaching'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Teaching
            </button>
          </div>
        </div>

        {activeTab === 'learning' ? (
          <>
            {/* Enrolled Courses Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Your Learning</h2>
                <Link href="/catalog">
                  <button className="text-primary hover:text-primary/80 font-medium text-sm">Browse more →</button>
                </Link>
              </div>

              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-6 rounded-lg border border-border bg-card hover-glow transition-all cursor-pointer group"
                    >
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {enrollment.course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3">{enrollment.course.instructor}</p>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Progress</span>
                              <span className="text-sm font-semibold text-primary">{enrollment.progress}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-card border border-border overflow-hidden">
                              <div
                                className="h-full bg-linear-to-r from-primary to-accent transition-all duration-500"
                                style={{ width: `${enrollment.progress}%` }}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground">Last accessed: {enrollment.lastAccessed}</p>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                          <Link href={`/course/${enrollment.course.id}`}>
                            <AnimatedButton className="flex-1 md:flex-none" size="sm">
                              Continue
                            </AnimatedButton>
                          </Link>
                          <ConfirmationModal
                            title="Unenroll from Course?"
                            description="Are you sure you want to unenroll? Your progress will be saved but you won't see this course in your dashboard anymore."
                            confirmText="Unenroll"
                            variant="destructive"
                            onConfirm={async () => {
                              try {
                                const res = await fetch(`/api/enrollments/${enrollment.course.id}`, { method: 'DELETE' });
                                if (res.ok) {
                                  setDashboardData(prev => prev ? ({
                                    ...prev,
                                    enrolledCourses: prev.enrolledCourses.filter(c => c.id !== enrollment.id)
                                  }) : null);
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Failed to unenroll');
                              }
                            }}
                            trigger={
                              <button
                                className="px-4 py-2 rounded-lg border border-border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all text-sm font-medium"
                                title="Unenroll"
                              >
                                <span className="sr-only">Unenroll</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-lg border border-border bg-card text-center">
                  <p className="text-muted-foreground">No courses enrolled yet. <Link href="/catalog" className="text-primary hover:underline">Browse courses</Link></p>
                </div>
              )}
            </div>

            {/* Recommended Courses */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
              {recommendedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendedCourses.map((course) => (
                    <CourseCard key={course.id} {...course} />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-lg border border-border bg-card text-center">
                  <p className="text-muted-foreground">No recommendations available yet.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Teaching Tab */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Created Courses</h2>
              <Link href="/upload">
                <AnimatedButton size="sm">
                  Create New Course
                </AnimatedButton>
              </Link>
            </div>

            {createdCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    onDelete={async (id) => {
                      try {
                        await import('@/lib/api').then(m => m.courseApi.deleteCourse(id))
                        setCreatedCourses(prev => prev.filter(c => c.id !== id))
                      } catch (e) {
                        console.error('Failed to delete course:', e)
                        alert('Failed to delete course')
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-lg border border-border bg-card text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Teaching Today</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Share your knowledge with the world. Create your first course and start earning.
                </p>
                <Link href="/upload">
                  <AnimatedButton>
                    Create Your First Course
                  </AnimatedButton>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  )
}