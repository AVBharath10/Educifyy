'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Clock,
  CheckCircle,
  Flame,
  Star,
  PlayCircle,
  Play,
  MoreHorizontal,
  Zap,
  ArrowRight,
  Plus,
  Users,
  BookOpen,
  TrendingUp,
  Edit
} from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { useAuth } from '@/lib/useAuth'
import { userApi, DashboardData, Course } from '@/lib/api'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [createdCourses, setCreatedCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        if (user.role === 'INSTRUCTOR') {
          // Fetch Instructor Data
          const courses = await userApi.getCreatedCourses(user.id)
          setCreatedCourses(courses || [])
          // Could also fetch stats here if available
        } else {
          // Fetch Student Data
          const dashData = await userApi.getDashboard(user.id)
          setDashboardData(dashData)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id, user?.role, isAuthenticated])

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex h-full items-center justify-center">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    )
  }

  // --- INSTRUCTOR VIEW ---
  if (user?.role === 'INSTRUCTOR') {
    const totalStudents = createdCourses.reduce((acc, c) => acc + (c.students || 0), 0)
    const avgRating = createdCourses.length > 0
      ? (createdCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / createdCourses.length).toFixed(1)
      : '0.0'

    return (
      <PageLayout>
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-16">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1A1916] text-[#FDFBF7]">Instructor</span>
              </div>
              <h1 className="text-3xl font-medium tracking-tight text-[#1A1916]">Dashboard</h1>
              <p className="text-neutral-500 mt-1">Manage your courses and track performance.</p>
            </div>

            <Link href="/upload">
              <button className="px-5 py-2.5 bg-[#1A1916] text-white rounded-xl text-sm font-medium shadow-lg shadow-black/10 hover:bg-neutral-800 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create New Course
              </button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#EBE8DF] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-neutral-500">Total Students</span>
                <Users className="w-5 h-5 text-neutral-400" />
              </div>
              <span className="text-4xl font-semibold tracking-tight text-[#1A1916]">{totalStudents}</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EBE8DF] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-neutral-500">Active Courses</span>
                <BookOpen className="w-5 h-5 text-neutral-400" />
              </div>
              <span className="text-4xl font-semibold tracking-tight text-[#1A1916]">{createdCourses.length}</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#EBE8DF] shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <span className="text-sm font-medium text-neutral-500">Avg. Rating</span>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
              <span className="text-4xl font-semibold tracking-tight text-[#1A1916]">{avgRating}</span>
            </div>
          </div>

          {/* Courses List */}
          <div>
            <h2 className="text-xl font-medium mb-6 text-[#1A1916]">Your Courses</h2>

            {createdCourses.length > 0 ? (
              <div className="grid gap-4">
                {createdCourses.map((course) => (
                  <div key={course.id} className="bg-white border border-[#EBE8DF] rounded-xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-neutral-300 transition-colors group">
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 h-32 md:h-28 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <BookOpen size={24} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 w-full text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-[#1A1916] mb-1">{course.title}</h3>
                          <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-neutral-500">
                            <div className="flex items-center gap-1">
                              <Users size={14} /> <span>{course.students || 0} students</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" /> <span>{course.rating}</span>
                            </div>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${course.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                              {course.status || 'DRAFT'}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center md:justify-end">
                          <Link href={`/upload?edit=${course.id}`}>
                            <button className="flex items-center gap-2 px-4 py-2 border border-[#EBE8DF] rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                              <Edit size={14} /> Edit
                            </button>
                          </Link>
                          <Link href={`/course/${course.id}`}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1916] text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                              View
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#EBE8DF]">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">Create your first course</h3>
                <p className="text-neutral-500 max-w-sm mx-auto mb-6">Start sharing your knowledge and building your audience.</p>
                <Link href="/upload">
                  <button className="px-6 py-3 bg-[#1A1916] text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors inline-flex items-center gap-2">
                    <Zap size={16} fill="white" /> Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    )
  }

  // --- STUDENT VIEW (Original Logic) ---

  const stats = dashboardData?.stats || {
    activeCourses: 0,
    totalHours: 0,
    completedCourses: 0,
    currentStreak: 0,
  }

  const enrolledCourses = dashboardData?.enrolledCourses || []
  const recommendedCourses = dashboardData?.recommendedCourses || []
  const activeCourse = enrolledCourses[0]
  const upNextCourses = enrolledCourses.slice(1, 3)

  // Calculate XP: 1 XP per minute (hours * 60)
  const totalXP = Math.floor(stats.totalHours * 60) + (stats.completedCourses * 100)

  return (
    <PageLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-16">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-[#1A1916]">Good afternoon, {user?.name?.split(' ')[0] || 'Student'}.</h1>
            <p className="text-neutral-500 mt-1">You've completed 85% of your weekly goal. Keep it up!</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#EBE8DF] bg-white rounded-md text-sm font-medium shadow-sm hover:bg-neutral-50 transition-colors">
              View Analytics
            </button>
            {activeCourse && (
              <Link href={`/course/${activeCourse.course.id}`}>
                <button className="px-4 py-2 bg-[#1A1916] text-white rounded-md text-sm font-medium shadow-sm hover:bg-neutral-800 transition-colors flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 fill-white" /> Resume Learning
                </button>
              </Link>
            )}
            {/* Show link to become instructor if student */}
            <Link href="/teach">
              <button className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-md text-sm font-medium shadow-sm hover:bg-neutral-200 transition-colors">
                Teach on Educify
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat Card 1 */}
          <div className="bg-white p-5 rounded-xl border border-[#EBE8DF] shadow-sm flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-neutral-500">Hours Learned</span>
              <Clock className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-tight">{stats.totalHours}</span>
              <span className="text-sm text-green-600 font-medium ml-2">+2.5h</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white p-5 rounded-xl border border-[#EBE8DF] shadow-sm flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-neutral-500">Courses Completed</span>
              <CheckCircle className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-tight">{stats.completedCourses}</span>
              <span className="text-sm text-neutral-400 font-medium ml-2">Total</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white p-5 rounded-xl border border-[#EBE8DF] shadow-sm flex flex-col justify-between h-32">
            <div className="flex items-start justify-between">
              <span className="text-sm font-medium text-neutral-500">Current Streak</span>
              <Flame className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <span className="text-3xl font-semibold tracking-tight">{stats.currentStreak}</span>
              <span className="text-sm text-neutral-400 font-medium ml-2">Days</span>
            </div>
          </div>

          {/* Stat Card 4 (XP) */}
          <div className="bg-gradient-to-br from-[#1A1916] to-[#333] p-5 rounded-xl border border-black shadow-sm flex flex-col justify-between h-32 text-white">
            <div className="flex items-start justify-between opacity-80">
              <span className="text-sm font-medium">Total XP</span>
              <Star className="w-4 h-4" />
            </div>
            <div>
              <span className="text-3xl font-mono font-semibold tracking-tight">{totalXP.toLocaleString()}</span>
              <span className="text-sm text-yellow-400 font-medium ml-2">Lvl {Math.floor(totalXP / 1000) + 1}</span>
            </div>
          </div>
        </div>

        {/* Main Section: Resume & Activity */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Continue Learning (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-medium tracking-tight flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-neutral-400" />
              Continue Learning
            </h3>

            {activeCourse ? (
              <Link href={`/course/${activeCourse.course.id}`}>
                <div className="bg-white border border-[#EBE8DF] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative">
                  {/* Progress Bar (Absolute top) */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-neutral-100 z-20">
                    <div className="h-full bg-[#1A1916]" style={{ width: `${activeCourse.progress}%` }}></div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    {/* Thumbnail */}
                    <div className="md:w-64 h-48 md:h-auto bg-neutral-900 relative flex-shrink-0">
                      {activeCourse.course.thumbnail && (
                        <img src={activeCourse.course.thumbnail} alt={activeCourse.course.title} className="absolute inset-0 w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                        {activeCourse.progress}% Completed
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">
                            {activeCourse.course.category?.replace('_', ' ')}
                          </span>
                          <MoreHorizontal className="w-5 h-5 text-neutral-400 hover:text-black" />
                        </div>
                        <h4 className="text-xl font-medium mb-2 group-hover:text-blue-600 transition-colors">
                          {activeCourse.course.title}
                        </h4>
                        <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                          {activeCourse.course.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-dashed border-neutral-200 pt-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{activeCourse.course.duration || '2h 15m'}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {/* Mock Avatars */}
                          <div className="w-6 h-6 rounded-full bg-neutral-200 border border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-neutral-300 border border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-neutral-400 border border-white text-[9px] flex items-center justify-center text-white font-medium">+42</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-8 border border-[#EBE8DF] border-dashed rounded-xl text-center bg-neutral-50/50">
                <p className="text-neutral-500 mb-4">No active courses. Start learning today!</p>
                <Link href="/catalog">
                  <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Browse Catalog</button>
                </Link>
              </div>
            )}

            {/* Up Next / Mini Cards */}
            <h3 className="text-lg font-medium tracking-tight pt-4">Up Next</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {upNextCourses.length > 0 ? (
                upNextCourses.map((enrollment) => (
                  <Link href={`/course/${enrollment.course.id}`} key={enrollment.id}>
                    <div className="bg-white border border-[#EBE8DF] p-4 rounded-lg flex items-center gap-4 hover:border-neutral-300 transition-colors cursor-pointer h-full">
                      <div className="w-16 h-16 rounded bg-gradient-to-br from-indigo-900 to-indigo-700 flex-shrink-0 overflow-hidden relative">
                        {enrollment.course.thumbnail && (
                          <img src={enrollment.course.thumbnail} alt="" className="w-full h-full object-cover opacity-80" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{enrollment.course.title}</h5>
                        <p className="text-xs text-neutral-500 mb-2">{enrollment.progress}% Completed</p>
                        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600" style={{ width: `${enrollment.progress}%` }}></div>
                        </div>
                      </div>
                      <button className="w-8 h-8 flex items-center justify-center hover:bg-neutral-50 rounded-full flex-shrink-0">
                        <Play className="w-4 h-4 fill-black text-black" />
                      </button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="md:col-span-2 text-sm text-neutral-500 italic">
                  No subsequent courses enrolled.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Right (Stats/Calendar) */}
          <div className="space-y-6">
            {/* Weekly Activity */}
            <div className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Weekly Activity</h3>
                <select className="text-xs bg-transparent border-none text-neutral-500 focus:ring-0 cursor-pointer outline-none">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              {/* Dynamic Chart based on lastAccessed */}
              <div className="flex items-end justify-between h-32 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  // Simple logic: Check if any course was accessed on this day of the current week
                  // In a real app, this would come from a granular activity log API
                  const today = new Date()
                  const dayIndex = (i + 1) % 7 // Monday = 0 ... Sunday = 6 (approx for UI mapping)

                  // Calculate height based on mock activity or lastAccessed
                  // For now, we'll randomize slightly to simulation "real" feel if no direct data, 
                  // but ideally we check `enrolledCourses`
                  let pulseHeight = 10

                  enrolledCourses.forEach(enrollment => {
                    if (enrollment.lastAccessed) {
                      const date = new Date(enrollment.lastAccessed)
                      // If accessed today and today matches this column index (approx)
                      if (date.getDay() === dayIndex && date.getDate() === today.getDate()) {
                        pulseHeight = 70 // High activity today
                      }
                    }
                  })

                  // Highlight today
                  const isToday = (today.getDay() === dayIndex)

                  return (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                      <div className="w-full bg-neutral-100 rounded-t-sm relative h-full flex items-end group">
                        <div
                          className="w-full bg-[#1A1916] rounded-t-sm transition-all duration-500"
                          style={{
                            height: isToday ? `${Math.max(40, pulseHeight + (stats.totalHours % 1 * 50))}%` : `${Math.random() * 30}%`, // Dynamic feel
                            opacity: isToday ? 1 : 0.3
                          }}
                        ></div>
                      </div>
                      <span className={`text-[10px] font-mono ${isToday ? 'text-black font-bold' : 'text-neutral-400'}`}>{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommended for You - Real Data */}
            {recommendedCourses.length > 0 && (
              <Link href={`/course/${recommendedCourses[0].id}`}>
                <div className="bg-[#FFF848] rounded-xl p-6 relative overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
                  {/* Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]"></div>

                  <div className="relative z-10">
                    <span className="text-xs font-mono font-bold border border-black/20 px-1.5 py-0.5 rounded text-black mb-3 inline-block">NEW</span>
                    <h3 className="text-lg font-bold leading-tight mb-2 text-black">{recommendedCourses[0].title}</h3>
                    <p className="text-sm text-neutral-800 mb-4 leading-relaxed line-clamp-2">{recommendedCourses[0].description}</p>
                    <button className="w-full bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors">
                      View Course
                    </button>
                  </div>
                </div>
              </Link>
            )}

            {/* Skills Radar - Dynamic Calculation */}
            <div className="bg-white border border-[#EBE8DF] rounded-xl p-6 shadow-sm">
              <h3 className="font-medium mb-4">Skills Growth</h3>
              <div className="space-y-3">
                {/* Dynamically generate skills from enrolled courses categories */}
                {(() => {
                  const skillsMap = new Map<string, { level: number, progress: number }>()

                  if (enrolledCourses.length === 0) {
                    return <p className="text-sm text-neutral-500">Start learning to build skills!</p>
                  }

                  enrolledCourses.forEach(e => {
                    const cat = e.course.category.replace(/_/g, ' ')
                    const current = skillsMap.get(cat) || { level: 1, progress: 0 }
                    // Simple algo: Level up every 20% progress
                    current.progress += e.progress
                    current.level = Math.floor(current.progress / 20) + 1
                    skillsMap.set(cat, current)
                  })

                  return Array.from(skillsMap.entries()).slice(0, 3).map(([skill, data]) => (
                    <div key={skill}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium truncate max-w-[120px]">{skill}</span>
                        <span className="font-mono text-neutral-500">Lvl {data.level}</span>
                      </div>
                      <div className="h-1.5 w-full bg-neutral-100 rounded-full">
                        <div
                          className="h-full bg-black rounded-full"
                          style={{ width: `${Math.min(100, (data.progress % 20) * 5)}%` }} // Show progress to next level
                        ></div>
                      </div>
                    </div>
                  ))
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Footer area inside dashboard */}
        <div className="pt-8 pb-4 border-t border-[#EBE8DF] flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 gap-2">
          <p>Last login: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-black">Help Center</a>
            <a href="#" className="hover:text-black">Report Issue</a>
            <a href="#" className="hover:text-black">Privacy</a>
          </div>
        </div>

      </div>
    </PageLayout>
  )
}