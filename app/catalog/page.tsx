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
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Explore Courses</h1>
          <p className="text-muted-foreground">Discover thousands of courses from expert instructors</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search courses, instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card hover:bg-card/80"
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={18} className={`ml-auto transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Category Filter */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-2`}>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground glow-blue border border-primary'
                      : 'border border-border bg-card hover:bg-card/80'
                  }`}
                >
                  {cat === 'All' ? 'All' : cat.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-2`}>
            <p className="text-sm font-semibold text-muted-foreground mb-3">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    selectedDifficulty === diff
                      ? 'bg-secondary text-secondary-foreground glow-purple border border-secondary'
                      : 'border border-border bg-card hover:bg-card/80'
                  }`}
                >
                  {diff === 'All' ? 'All' : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="md:ml-auto flex items-end">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses found
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-destructive mb-2">Failed to load courses</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">No courses found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && allCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No courses available yet</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
