'use client'

import { useState, useEffect } from 'react'
import { Upload, Plus, X, FileVideo, FileText, CheckCircle, Save, ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import { PageLayout } from '@/components/page-layout'
import { AnimatedButton } from '@/components/animated-button'
import { ConfirmationModal } from '@/components/confirmation-modal'
import { useRouter, useParams } from 'next/navigation'
import { courseApi, uploadApi } from '@/lib/api'
import { useAuth } from '@/lib/useAuth'
import Link from 'next/link'

interface Module {
    id: string
    title: string
    type: 'video' | 'document' | 'text'
    fileName?: string
    file?: File | null
    url?: string
    content?: string
    isUploading?: boolean
    isNew?: boolean
}

export default function EditCoursePage() {
    const router = useRouter()
    const params = useParams()
    const courseId = params?.id as string
    const { user, isAuthenticated, isInitialized } = useAuth()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Web Development',
        difficulty: 'Beginner',
    })

    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
    const [modules, setModules] = useState<Module[]>([])
    const [isLoading, setIsLoading] = useState(true)
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

    // Fetch course data
    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return

            try {
                setIsLoading(true)
                const data = await courseApi.getCourse(courseId)

                // Check ownership
                const ownerId = data.instructorId || (data.instructor as any)?.id
                if (isAuthenticated && user?.id && ownerId !== user.id) {
                    console.log('Ownership check failed:', { ownerId, userId: user.id })
                    router.push(`/course/${courseId}`)
                    return
                }

                setFormData({
                    title: data.title,
                    description: data.description || '',
                    category: data.category,
                    difficulty: data.difficulty,
                })

                if (data.thumbnail) {
                    setThumbnailPreview(data.thumbnail)
                }

                if (data.modules) {
                    setModules(data.modules.map((m: any) => ({
                        id: m.id,
                        title: m.title,
                        type: m.type.toLowerCase(),
                        url: m.url,
                        content: m.content,
                        fileName: m.fileName,
                        isNew: false
                    })))
                }

            } catch (error) {
                console.error('Failed to fetch course:', error)
                alert('Failed to load course details')
            } finally {
                setIsLoading(false)
            }
        }

        if (isInitialized) {
            if (!isAuthenticated) {
                router.push('/auth/login')
            } else {
                fetchCourse()
            }
        }
    }, [courseId, isAuthenticated, isInitialized, user?.id, router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const addModule = (type: 'video' | 'document' | 'text') => {
        const newModule: Module = {
            id: `new-${Date.now()}`,
            title: `${type === 'video' ? 'Video' : type === 'text' ? 'Article' : 'Document'} Module ${modules.length + 1}`,
            type,
            isNew: true
        }
        setModules((prev) => [...prev, newModule])
    }

    const removeModule = async (id: string) => {
        // If it's a new module (not saved yet), just remove from state
        if (id.startsWith('new-')) {
            setModules((prev) => prev.filter((m) => m.id !== id))
            return
        }

        // If it's an existing module, delete via API
        try {
            if (!confirm('Are you sure you want to delete this module? This cannot be undone.')) return

            await courseApi.deleteModule(id)
            setModules((prev) => prev.filter((m) => m.id !== id))
        } catch (error) {
            console.error('Failed to delete module:', error)
            alert('Failed to delete module')
        }
    }

    const updateModuleState = (id: string, updates: Partial<Module>) => {
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
        setStatusMessage('Saving changes...')

        try {
            // 1. Upload new Thumbnail if changed
            let thumbnailUrl = thumbnailPreview
            if (thumbnailFile) {
                setStatusMessage('Uploading new thumbnail...')
                const res = await uploadApi.uploadFile(thumbnailFile, 'thumbnail')
                thumbnailUrl = res.url
                setUploadProgress(10)
            }

            // 2. Update Course Details
            setStatusMessage('Updating course details...')

            const formattedCategory = formData.category
                .toUpperCase()
                .replace(/ /g, '_')
                .replace(/\//g, '_')

            const formattedDifficulty = formData.difficulty.toUpperCase()

            await courseApi.updateCourse(courseId, {
                ...formData,
                category: formattedCategory as any,
                difficulty: formattedDifficulty as any,
                thumbnail: thumbnailUrl || undefined,
            })

            setUploadProgress(30)

            // 3. Process Modules (Update existing, Create new)
            const totalModules = modules.length

            for (let i = 0; i < totalModules; i++) {
                const module = modules[i]
                const progress = 30 + Math.round(((i + 1) / totalModules) * 70)

                // Skip if no changes needed (simplified check)
                // In a real app, we'd track dirty state per module

                setStatusMessage(`Processing module ${i + 1}: ${module.title}...`)

                let moduleUrl = module.url || ''

                // Upload new file if present
                if (module.file) {
                    const res = await uploadApi.uploadFile(module.file, module.type)
                    moduleUrl = res.url
                }

                const moduleData = {
                    title: module.title,
                    type: module.type.toUpperCase(),
                    url: moduleUrl || undefined,
                    content: module.content || undefined,
                    fileName: module.fileName || 'untitled',
                    order: i,
                    duration: module.type === 'video' ? '5 min' : '10 min read'
                }

                if (module.isNew) {
                    // Create new module
                    await courseApi.addModule(courseId, moduleData)
                } else {
                    // Update existing module
                    await courseApi.updateModule(module.id, moduleData)
                }

                setUploadProgress(progress)
            }

            setStatusMessage('Course updated successfully!')
            setUploadProgress(100)

            // Redirect back to course page
            setTimeout(() => {
                router.push(`/course/${courseId}`)
            }, 1000)

        } catch (error: any) {
            console.error('Update failed:', error)
            setStatusMessage(`Error: ${error.message || 'Update failed'}`)
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="p-4 md:p-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <Link href={`/course/${courseId}`}>
                        <button className="p-2 rounded-full hover:bg-muted transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Edit Course</h1>
                        <p className="text-muted-foreground">Update your course content and details</p>
                    </div>
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
                                rows={6}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                required
                            />
                        </div>

                        {/* Category and Difficulty */}
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

                        {/* Thumbnail */}
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
                                    <div className="relative h-48 w-full group">
                                        <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover rounded-md" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                            <p className="text-white font-medium">Click to change</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={32} className="mx-auto mb-2 text-muted-foreground" />
                                        <p className="font-medium mb-1">Drag and drop or click to upload</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modules Section */}
                    <div className="space-y-6 p-6 rounded-lg border border-border bg-card">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Course Modules</h2>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => addModule('video')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 font-medium transition-all text-sm"
                                >
                                    <Plus size={16} /> Video
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addModule('text')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 font-medium transition-all text-sm"
                                >
                                    <Plus size={16} /> Article
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addModule('document')}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 font-medium transition-all text-sm"
                                >
                                    <Plus size={16} /> Document
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {modules.map((module, index) => (
                                <div key={module.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background/50">
                                    <div className="mt-1">
                                        {module.type === 'video' ? (
                                            <FileVideo size={20} className="text-primary" />
                                        ) : module.type === 'text' ? (
                                            <FileText size={20} className="text-primary" />
                                        ) : (
                                            <FileText size={20} className="text-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={module.title}
                                                onChange={(e) => updateModuleState(module.id, { title: e.target.value })}
                                                placeholder="Module Title"
                                                className="flex-1 px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                                            />
                                            {module.isNew && <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary self-center">New</span>}
                                        </div>

                                        {module.type === 'text' ? (
                                            <textarea
                                                value={module.content || ''}
                                                onChange={(e) => updateModuleState(module.id, { content: e.target.value })}
                                                placeholder="Article content..."
                                                rows={4}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                {module.url && !module.file && (
                                                    <a href={module.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate max-w-[200px]">
                                                        View current file
                                                    </a>
                                                )}
                                                <div className="relative overflow-hidden">
                                                    <button type="button" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                                                        <Upload size={14} />
                                                        {module.file ? 'Change File' : (module.url ? 'Replace File' : 'Upload File')}
                                                    </button>
                                                    <input
                                                        type="file"
                                                        accept={module.type === 'video' ? "video/*" : ".pdf,.doc,.docx,.txt"}
                                                        onChange={(e) => handleModuleFileChange(module.id, e)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                                {module.fileName && <span className="text-xs text-muted-foreground">{module.fileName}</span>}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeModule(module.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                        title="Delete Module"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4 sticky bottom-4 z-10">
                        <AnimatedButton
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 shadow-xl"
                            size="lg"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    {statusMessage}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Save size={20} />
                                    Save Changes
                                </span>
                            )}
                        </AnimatedButton>
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
