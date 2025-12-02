'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await courseApi.getCourses({ authenticated: false } as any)
        // Extract courses array from paginated response
        const coursesArray = response?.data || []
        setAllCourses(Array.isArray(coursesArray) ? coursesArray : [])
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
    <PageLayout>
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Header & Search */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Explore Courses</h1>

          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search for courses, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          {/* Filters Section */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-background/95 backdrop-blur-xl py-4 border-b border-border/50">
            {/* Categories (Horizontal Scroll) */}
            <div className="w-full md:w-auto flex-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <div className="flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat
                        ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                        : 'bg-card hover:bg-muted border-border text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {cat === 'All' ? 'All' : cat.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Dropdown */}
            <div className="relative group shrink-0">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 transition-colors text-sm font-medium"
              >
                <Filter size={16} className="text-muted-foreground" />
                <span>{selectedDifficulty === 'All' ? 'Any Difficulty' : selectedDifficulty}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              {/* Dropdown Menu (Simple Hover/Focus implementation) */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${selectedDifficulty === diff ? 'text-primary font-medium bg-primary/5' : 'text-muted-foreground'
                      }`}
                  >
                    {diff === 'All' ? 'Any Difficulty' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6 pb-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {selectedCategory === 'All' ? 'All Courses' : selectedCategory.replace(/_/g, ' ')}
              </h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredCourses.length}</span> results
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-lg text-destructive mb-2">Failed to load courses</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            )}

            {/* Courses Grid */}
            {!isLoading && !error && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
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
                ))}
              </div>
            )}

            {/* No Results State */}
            {!isLoading && !error && filteredCourses.length === 0 && allCourses.length > 0 && (
              <div className="text-center py-20 bg-card/50 rounded-xl border border-border border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={32} />
                </div>
                <p className="text-xl font-semibold mb-2">No courses found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSelectedDifficulty('All')
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && allCourses.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl font-semibold text-muted-foreground">No courses available yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
