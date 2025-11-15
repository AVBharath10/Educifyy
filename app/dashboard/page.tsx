'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Clock, CheckCircle, BookOpen, TrendingUp, Download, Settings, Loader2 } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { CourseCard } from '@/components/course-card'
import { AnimatedButton } from '@/components/animated-button'
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
    <div className="p-6 rounded-lg border border-border bg-card hover-glow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
          {icon}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await userApi.getDashboard(user.id)
        setDashboardData(data)
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err)
        setError(err.message || 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
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
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Learning Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BookOpen size={20} className="text-primary" />}
            label="Active Courses"
            value={stats.activeCourses}
            bg="bg-primary/20"
          />

          <StatCard
            icon={<Clock size={20} className="text-accent" />}
            label="Total Hours"
            value={`${stats.totalHours}h`}
            bg="bg-accent/20"
          />

          <StatCard
            icon={<CheckCircle size={20} className="text-secondary" />}
            label="Completed"
            value={stats.completedCourses}
            bg="bg-secondary/20"
          />

          <StatCard
            icon={<TrendingUp size={20} className="text-primary" />}
            label="Day Streak"
            value={`${stats.currentStreak} days`}
            bg="bg-primary/20"
          />
        </div>

        {/* Enrolled Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Courses</h2>
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
                      <button className="px-4 py-2 rounded-lg border border-border hover:bg-card transition-all text-sm font-medium">
                        <Download size={16} />
                      </button>
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
      </div>
    </PageLayout>
  )
}