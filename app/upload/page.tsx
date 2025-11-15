'use client'

import { useState } from 'react'
import { Upload, Plus, X, FileVideo, FileText } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { AnimatedButton } from '@/components/animated-button'

interface Module {
  id: string
  title: string
  type: 'video' | 'document'
  fileName?: string
}

export default function UploadCoursePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
    price: '',
  })

  const [modules, setModules] = useState<Module[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const categories = [
    'Web Development',
    'Data Science',
    'AI/ML',
    'Design',
    'Business',
    'Music',
    'Photography',
    'Language Learning',
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addModule = (type: 'video' | 'document') => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: `${type === 'video' ? 'Video' : 'Document'} Module ${modules.length + 1}`,
      type,
    }
    setModules((prev) => [...prev, newModule])
  }

  const removeModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id))
  }

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    setTimeout(() => {
      setIsSubmitting(false)
      setUploadProgress(0)
      alert('Course uploaded successfully!')
    }, 500)
  }

  return (
    <PageLayout>
      <div className="p-4 md:p-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Upload Your Course</h1>
          <p className="text-muted-foreground">Share your knowledge with thousands of learners worldwide</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Details Section */}
          <div className="space-y-6 p-6 rounded-lg border border-border bg-card">
            <h2 className="text-2xl font-bold">Course Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Advanced React Patterns"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your course, what students will learn, and what makes it unique..."
                rows={6}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Category and Difficulty Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Price ($)</label>
              <div className="flex items-center">
                <span className="text-muted-foreground mr-2">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="99.99"
                  step="0.01"
                  min="0"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Thumbnail</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-card/50">
                <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                <p className="font-medium mb-1">Drag and drop or click to upload</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Course Modules Section */}
          <div className="space-y-6 p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Course Modules</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addModule('video')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => addModule('document')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 font-medium transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Document</span>
                </button>
              </div>
            </div>

            {/* Modules List */}
            {modules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No modules added yet. Add a video or document to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50">
                    <div className="mt-1">
                      {module.type === 'video' ? (
                        <FileVideo size={20} className="text-primary" />
                      ) : (
                        <FileText size={20} className="text-accent" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(module.id, { title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium mb-2"
                      />
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer bg-card/50">
                        <Upload size={20} className="mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload {module.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModule(module.id)}
                      className="mt-1 p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-destructive"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              className="flex-1 disabled:opacity-50"
              size="lg"
            >
              {isSubmitting ? `Publishing... ${uploadProgress}%` : 'Publish Course'}
            </AnimatedButton>
            <button
              type="button"
              className="px-8 py-3 rounded-lg border border-border hover:bg-card transition-all font-semibold"
            >
              Save Draft
            </button>
          </div>

          {/* Progress Bar */}
          {isSubmitting && (
            <div className="w-full bg-card rounded-lg h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </form>
      </div>
    </PageLayout>
  )
}
