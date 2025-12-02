'use client'

import { useState } from 'react'
import { Upload, Plus, X, FileVideo, FileText, CheckCircle } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { AnimatedButton } from '@/components/animated-button'

import { useRouter } from 'next/navigation'
import { courseApi, uploadApi } from '@/lib/api'

interface Module {
  id: string
  title: string
  type: 'video' | 'document' | 'text'
  fileName?: string
  file?: File | null
  url?: string
  content?: string
  isUploading?: boolean
}

export default function UploadCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    difficulty: 'Beginner',
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')

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

  const addModule = (type: 'video' | 'document' | 'text') => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: `${type === 'video' ? 'Video' : type === 'text' ? 'Article' : 'Document'} Module ${modules.length + 1}`,
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleModuleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setModules((prev) =>
        prev.map((m) => (m.id === id ? { ...m, file, fileName: file.name } : m))
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setUploadProgress(0)
    setStatusMessage('Starting upload...')

    // Client-side validation
    if (formData.title.length < 5) {
      setStatusMessage('Error: Title must be at least 5 characters')
      setIsSubmitting(false)
      return
    }

    // Description length check removed as per user request

    try {
      // 1. Upload Thumbnail
      let thumbnailUrl = ''
      if (thumbnailFile) {
        setStatusMessage('Uploading thumbnail...')
        const res = await uploadApi.uploadFile(thumbnailFile, 'thumbnail')
        thumbnailUrl = res.url
        setUploadProgress(10)
      }

      // 2. Create Course
      setStatusMessage('Creating course...')

      // Format category and difficulty to match API schema
      const formattedCategory = formData.category
        .toUpperCase()
        .replace(/ /g, '_')
        .replace(/\//g, '_') // Handle AI/ML -> AI_ML

      const formattedDifficulty = formData.difficulty.toUpperCase()

      const courseData = {
        ...formData,
        category: formattedCategory,
        difficulty: formattedDifficulty,
        price: 0,
        thumbnail: thumbnailUrl,
        duration: '0h', // Calculate based on modules later
        status: 'PUBLISHED',
      }

      const createdCourse = await courseApi.createCourse(courseData)
      setUploadProgress(30)

      // 3. Upload Modules and Add to Course
      const totalModules = modules.length

      for (let i = 0; i < totalModules; i++) {
        const module = modules[i]
        setStatusMessage(`Uploading module ${i + 1} of ${totalModules}: ${module.title}...`)

        let moduleUrl = module.url || ''
        if (module.file) {
          const res = await uploadApi.uploadFile(module.file, module.type)
          moduleUrl = res.url
        }

        await courseApi.addModule(createdCourse.id, {
          title: module.title,
          type: module.type.toUpperCase(),
          url: moduleUrl,
          content: module.content,
          fileName: module.fileName || 'untitled',
          order: i,
          duration: module.type === 'video' ? '5 min' : '10 min read'
        })

        setUploadProgress(30 + Math.round(((i + 1) / totalModules) * 70))
      }

      setStatusMessage('Course published successfully!')
      setUploadProgress(100)

      // Redirect to course page
      setTimeout(() => {
        router.push(`/course/${createdCourse.id}`)
      }, 1000)

    } catch (error: any) {
      console.error('Upload failed:', error)
      setStatusMessage(`Error: ${error.message || 'Upload failed'}`)
      setIsSubmitting(false)
    }
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

            {/* Price (Hidden/Free) */}
            {/* Price input removed as per request, defaulting to free/0 */}

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Course Thumbnail</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer bg-card/50 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {thumbnailPreview ? (
                  <div className="relative h-48 w-full">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-md" />
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium mb-1">Drag and drop or click to upload</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
                  </>
                )}
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
                  onClick={() => addModule('text')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 font-medium transition-all"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add Article</span>
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
                <p>No modules added yet. Add a video, article, or document to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50">
                    <div className="mt-1">
                      {module.type === 'video' ? (
                        <FileVideo size={20} className="text-primary" />
                      ) : module.type === 'text' ? (
                        <FileText size={20} className="text-accent" />
                      ) : (
                        <FileText size={20} className="text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(module.id, { title: e.target.value })}
                        placeholder="Module Title"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      />

                      {module.type === 'text' ? (
                        <textarea
                          value={module.content || ''}
                          onChange={(e) => updateModule(module.id, { content: e.target.value })}
                          placeholder="Write your article content here (Markdown supported)..."
                          rows={6}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                        />
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer bg-card/50 relative">
                          <input
                            type="file"
                            accept={module.type === 'video' ? "video/*" : ".pdf,.doc,.docx,.txt"}
                            onChange={(e) => handleModuleFileChange(module.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {module.fileName ? (
                            <div className="flex items-center justify-center gap-2 text-primary">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium truncate max-w-[200px]">{module.fileName}</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={20} className="mx-auto mb-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Click to upload {module.type}</p>
                            </>
                          )}
                        </div>
                      )}
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
              {isSubmitting ? statusMessage : 'Publish Course'}
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
