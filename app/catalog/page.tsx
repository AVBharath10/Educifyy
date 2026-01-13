'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react'
import { SiteHeader } from '@/components/landing/site-header'
import { SiteFooter } from '@/components/landing/site-footer'
import { CourseCard } from '@/components/course-card'
import { courseApi } from '@/lib/api'

const categories = ['All', 'WEB_DEVELOPMENT', 'DATA_SCIENCE', 'AI_ML', 'DESIGN', 'BUSINESS', 'MUSIC']
const difficulties = ['All', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function CatalogPage() {
  const [allCourses, setAllCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await courseApi.getCourses({ authenticated: false } as any)
        // Check if response is array or has data property
        const coursesArray = Array.isArray(response) ? response : (response as any)?.data || []
        setAllCourses(coursesArray)
      } catch (err: any) {
        console.error('Failed to fetch courses:', err)
        setError(err.message || 'Failed to load courses')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = allCourses.filter((course) => {
    const instructorName = course.instructor?.name || 'Unknown'
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <SiteHeader />
      <main className="flex-1 w-full">
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
          {/* Header */}
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 pt-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-[#1A1916]">
              Explore Catalog
            </h1>
            <p className="text-lg text-neutral-500 mb-8 leading-relaxed">
              Discover courses taught by industry experts. Master new skills in design,
              development, business, and more.
            </p>

            <div className="relative max-w-xl mx-auto group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Search for courses, skills, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#EBE8DF] rounded-xl text-base shadow-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all placeholder:text-neutral-400 hover:border-neutral-300"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-[#EBE8DF]">
            {/* Categories */}
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar mask-gradient-right">
              <div className="flex items-center gap-2 pr-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${selectedCategory === cat
                      ? 'bg-[#1A1916] text-[#FDFBF7] border-[#1A1916] shadow-md transform scale-105'
                      : 'bg-white text-neutral-500 border-[#EBE8DF] hover:border-neutral-300 hover:text-black hover:bg-neutral-50'
                      }`}
                  >
                    {cat === 'All' ? 'All Courses' : cat.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative group shrink-0">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#EBE8DF] hover:border-neutral-300 transition-all text-sm font-medium hover:shadow-sm"
              >
                <Filter size={16} className="text-neutral-400" />
                <span>{selectedDifficulty === 'All' ? 'Filter by Level' : selectedDifficulty}</span>
                <ChevronDown size={14} className="text-neutral-400" />
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EBE8DF] rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                <div className="p-1">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-colors ${selectedDifficulty === diff
                        ? 'bg-neutral-100 text-black font-medium'
                        : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                        }`}
                    >
                      {diff === 'All' ? 'All Levels' : diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20 bg-red-50/50 rounded-xl border border-red-100">
                <p className="text-sm text-red-600 mb-1">Unable to load courses</p>
                <p className="text-xs text-red-500 opacity-80">{error}</p>
              </div>
            )}

            {/* Grid */}
            {!isLoading && !error && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CourseCard
                      id={course.id}
                      title={course.title}
                      instructor={course.instructor?.name || 'Unknown'}
                      category={course.category}
                      difficulty={course.difficulty}
                      rating={course.rating}
                      students={course.studentsEnrolled}
                      duration={course.duration}
                      thumbnail={course.thumbnail}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty States */}
            {!isLoading && !error && filteredCourses.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#EBE8DF]">
                <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No courses found</h3>
                <p className="text-neutral-500 text-sm mb-4">Adjust your filters to see more results</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedDifficulty('All')
                  }}
                  className="text-xs font-medium text-black underline hover:text-neutral-600"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
