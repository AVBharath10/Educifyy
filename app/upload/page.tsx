'use client'

import { useState, useEffect } from 'react'
import { Upload, Plus, X, FileVideo, FileText, CheckCircle, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'

import { useRouter, useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  const courseIdToEdit = searchParams.get('edit')
  const isEditing = !!courseIdToEdit

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
  const [isLoading, setIsLoading] = useState(false) // For fetching existing course
  const [uploadProgress, setUploadProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  const categories = [
    'Web Development',
    'Data Science',
    'AI_ML',
    'Design',
    'Business',
    'Music',
    'Photography',
    'Language Learning',
  ]

  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  // Fetch course data if editing
  useEffect(() => {
    if (!courseIdToEdit) return

    const fetchCourse = async () => {
      try {
        setIsLoading(true)
        const course = await courseApi.getCourse(courseIdToEdit)

        setFormData({
          title: course.title,
          description: course.description || '',
          category: course.category.replace(/_/g, ' '),
          difficulty: course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1).toLowerCase(),
        })

        if (course.thumbnail) {
          setThumbnailPreview(course.thumbnail)
        }

        if (course.modules) {
          setModules(course.modules.map((m: any) => ({
            id: m.id,
            title: m.title,
            type: m.type.toLowerCase(),
            url: m.url,
            content: m.content,
            fileName: m.fileName,
          })))
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to load course for editing:', err)
        setStatusMessage('Failed to load course details.')
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [courseIdToEdit])

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
    setError(null)
    setUploadProgress(0)
    setStatusMessage(isEditing ? 'Starting update...' : 'Starting upload...')

    // Client-side validation
    if (formData.title.length < 5) {
      setError('Title must be at least 5 characters long')
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!formData.category) {
      setError('Please select a category')
      setIsSubmitting(false)
      return
    }

    if (modules.length === 0) {
      setError('Please add at least one module')
      setIsSubmitting(false)
      return
    }

    for (const m of modules) {
      if (!m.title) {
        setError('All modules must have a title')
        setIsSubmitting(false)
        return
      }
      if (m.type === 'text' && !m.content) {
        setError(`Please add content for module: ${m.title}`)
        setIsSubmitting(false)
        return
      }
      if (m.type !== 'text' && !m.file && !m.url) {
        setError(`Please upload a file for module: ${m.title}`)
        setIsSubmitting(false)
        return
      }
    }

    try {
      let thumbnailUrl = thumbnailPreview
      if (thumbnailFile) {
        setStatusMessage('Uploading thumbnail...')
        const res = await uploadApi.uploadFile(thumbnailFile, 'thumbnail')
        thumbnailUrl = res.url
        setUploadProgress(10)
      }

      setStatusMessage(isEditing ? 'Updating course details...' : 'Creating course...')

      const formattedCategory = formData.category.toUpperCase().replace(/ /g, '_').replace(/\//g, '_')
      const formattedDifficulty = formData.difficulty.toUpperCase()

      const courseData = {
        ...formData,
        category: formattedCategory,
        difficulty: formattedDifficulty,
        price: 0,
        thumbnail: thumbnailUrl || undefined,
        duration: '0h',
        status: 'PUBLISHED',
      }

      let courseId = courseIdToEdit

      if (isEditing && courseIdToEdit) {
        await courseApi.updateCourse(courseIdToEdit, courseData)
      } else {
        const createdCourse = await courseApi.createCourse(courseData)
        courseId = createdCourse.id
      }

      setUploadProgress(30)

      const totalModules = modules.length

      for (let i = 0; i < totalModules; i++) {
        const module = modules[i]

        if (!module.file && module.url && module.id && isEditing) {
          if (module.id.length > 20) {
            await courseApi.updateModule(module.id, {
              title: module.title,
              content: module.content,
              order: i
            })
            continue
          }
        }

        setStatusMessage(`Processing module ${i + 1} of ${totalModules}: ${module.title}...`)

        let moduleUrl = module.url || ''
        if (module.file) {
          const res = await uploadApi.uploadFile(module.file, module.type)
          moduleUrl = res.url
        }

        if (module.id.length < 15 || !isEditing) {
          await courseApi.addModule(courseId!, {
            title: module.title,
            type: module.type.toUpperCase(),
            url: moduleUrl,
            content: module.content,
            fileName: module.fileName || 'untitled',
            order: i,
            duration: module.type === 'video' ? '5 min' : '10 min read'
          })
        }

        setUploadProgress(30 + Math.round(((i + 1) / totalModules) * 70))
      }

      setStatusMessage(isEditing ? 'Course updated successfully!' : 'Course published successfully!')
      setUploadProgress(100)

      setTimeout(() => {
        router.push(`/course/${courseId}`)
      }, 1000)

    } catch (error: any) {
      console.error('Upload failed:', error)
      setError(error.message || 'Operation failed')
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDraft = async () => {
    setIsSubmitting(true)
    setError(null)
    setStatusMessage('Saving draft...')

    try {
      if (!formData.title) {
        setError('Please add a title to save a draft')
        setIsSubmitting(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const formattedCategory = formData.category.toUpperCase().replace(/ /g, '_').replace(/\//g, '_')
      const formattedDifficulty = formData.difficulty.toUpperCase()

      const courseData = {
        ...formData,
        category: formattedCategory,
        difficulty: formattedDifficulty,
        price: 0,
        thumbnail: thumbnailPreview || undefined,
        duration: '0h',
        status: 'DRAFT',
      }

      if (thumbnailFile) {
        setStatusMessage('Uploading thumbnail...')
        const res = await uploadApi.uploadFile(thumbnailFile, 'thumbnail')
        courseData.thumbnail = res.url
      }

      let courseId = courseIdToEdit
      if (isEditing && courseIdToEdit) {
        await courseApi.updateCourse(courseIdToEdit, courseData)
      } else {
        const createdCourse = await courseApi.createCourse(courseData)
        courseId = createdCourse.id
      }

      if (modules.length > 0) {
        setStatusMessage('Saving modules...')
        for (let i = 0; i < modules.length; i++) {
          const module = modules[i]
          let moduleUrl = module.url || ''
          if (module.file) {
            const res = await uploadApi.uploadFile(module.file, module.type)
            moduleUrl = res.url
          }

          if (module.id.length < 15 || !isEditing) {
            await courseApi.addModule(courseId!, {
              title: module.title || 'Untitled Module',
              type: module.type.toUpperCase(),
              url: moduleUrl,
              content: module.content || '',
              fileName: module.fileName || 'untitled',
              order: i,
              duration: '0 min'
            })
          }
        }
      }

      setStatusMessage('Draft saved successfully!')
      setTimeout(() => {
        router.push('/teach')
      }, 1000)

    } catch (error: any) {
      console.error('Draft save failed:', error)
      setError(error.message || 'Failed to save draft')
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <PageLayout>
      <div className="p-6 md:p-12 max-w-5xl mx-auto">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          {isEditing && (
            <button onClick={() => router.back()} className="mb-4 flex items-center gap-2 justify-center text-neutral-500 hover:text-black transition-colors">
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <h1 className="text-4xl font-medium tracking-tight mb-3 text-[#1A1916]">
            {isEditing ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-neutral-500 text-lg">
            {isEditing ? 'Update your course content and details' : 'Share your knowledge with thousands of learners worldwide'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-base font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-8 p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm">
            <h2 className="text-2xl font-medium tracking-tight text-[#1A1916]">Course Details</h2>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1A1916]">Course Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Advanced React Patterns"
                className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1A1916]">Course Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your course, what students will learn, and what makes it unique..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1A1916]">Category</label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black appearance-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1A1916]">Difficulty Level</label>
                <div className="relative">
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#EBE8DF] bg-[#FDFBF7] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black appearance-none transition-all"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#1A1916]">Course Thumbnail</label>
              <div className="border-2 border-dashed border-[#EBE8DF] rounded-xl p-8 text-center hover:border-neutral-400 transition-colors cursor-pointer bg-[#FDFBF7] relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {thumbnailPreview ? (
                  <div className="relative h-64 w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-md">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium">
                      Change Image
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EBE8DF] shadow-sm">
                      <Upload size={24} className="text-neutral-400" />
                    </div>
                    <p className="font-medium mb-1 text-[#1A1916]">Click to upload thumbnail</p>
                    <p className="text-sm text-neutral-500">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 p-8 rounded-2xl border border-[#EBE8DF] bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tight text-[#1A1916]">Course Modules</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addModule('video')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1916] text-[#FDFBF7] hover:bg-neutral-800 font-medium transition-all text-sm shadow-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => addModule('text')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 hover:bg-neutral-200 font-medium transition-all text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Article</span>
                </button>
                <button
                  type="button"
                  onClick={() => addModule('document')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200 hover:bg-neutral-200 font-medium transition-all text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Document</span>
                </button>
              </div>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12 border border-[#EBE8DF] border-dashed rounded-xl bg-[#FDFBF7]">
                <p className="text-neutral-500">No modules added yet. Add a video, article, or document to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <div key={module.id} className="flex items-start gap-5 p-5 rounded-xl border border-[#EBE8DF] bg-[#FDFBF7]">
                    <div className="mt-1 p-2 bg-white rounded-lg border border-[#EBE8DF] shadow-sm">
                      {module.type === 'video' ? (
                        <FileVideo size={20} className="text-blue-500" />
                      ) : module.type === 'text' ? (
                        <FileText size={20} className="text-orange-500" />
                      ) : (
                        <FileText size={20} className="text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(module.id, { title: e.target.value })}
                        placeholder="Module Title"
                        className="w-full px-3 py-2 rounded-lg border border-[#EBE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-sm font-medium transition-all"
                      />

                      {module.type === 'text' ? (
                        <textarea
                          value={module.content || ''}
                          onChange={(e) => updateModule(module.id, { content: e.target.value })}
                          placeholder="Write your article content here (Markdown supported)..."
                          rows={6}
                          className="w-full px-3 py-2 rounded-lg border border-[#EBE8DF] bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black text-sm font-mono transition-all"
                        />
                      ) : (
                        <div className="border-2 border-dashed border-[#EBE8DF] rounded-xl p-6 text-center hover:border-neutral-400 transition-colors cursor-pointer bg-white relative">
                          <input
                            type="file"
                            accept={module.type === 'video' ? "video/*" : ".pdf,.doc,.docx,.txt"}
                            onChange={(e) => handleModuleFileChange(module.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          {module.fileName ? (
                            <div className="flex items-center justify-center gap-2 text-[#1A1916]">
                              <CheckCircle size={16} className="text-emerald-500" />
                              <span className="text-sm font-medium truncate max-w-[200px]">{module.fileName}</span>
                            </div>
                          ) : (
                            <>
                              <Upload size={20} className="mx-auto mb-2 text-neutral-400" />
                              <p className="text-xs text-neutral-500 font-medium">Click to upload {module.type}</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeModule(module.id)}
                      className="mt-1 p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-[#EBE8DF]">
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex-1 bg-[#1A1916] text-[#FDFBF7] py-4 rounded-xl font-medium hover:bg-neutral-800 transition-all text-lg shadow-lg shadow-black/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  isEditing ? 'Update Course' : 'Publish Course'
                )}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSubmitting || isLoading}
                className="px-8 py-4 rounded-xl border border-[#EBE8DF] bg-white hover:bg-neutral-50 transition-all font-medium text-[#1A1916]"
              >
                Save Draft
              </button>
            </div>

            {isSubmitting && (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between text-sm font-medium text-neutral-500">
                  <span>Progress</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#EBE8DF] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-[#1A1916] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-center text-sm text-neutral-400 mt-2">
                  Please do not close this window while we upload your content.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
