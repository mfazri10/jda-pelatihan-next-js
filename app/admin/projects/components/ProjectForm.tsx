'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project, createProject, updateProject, getProjectById } from '@/lib/projects'

interface ProjectFormProps {
  projectId?: string
  isEdit?: boolean
}

export default function ProjectForm({ projectId, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: [] as string[],
    imageUrl: '',
    demoUrl: '',
    githubUrl: '',
    category: '',
    featured: false
  })
  const [technologyInput, setTechnologyInput] = useState('')

  useEffect(() => {
    if (isEdit && projectId) {
      fetchProject()
    }
  }, [isEdit, projectId])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const project = await getProjectById(projectId!)
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          longDescription: project.longDescription,
          technologies: project.technologies,
          imageUrl: project.imageUrl || '',
          demoUrl: project.demoUrl || '',
          githubUrl: project.githubUrl || '',
          category: project.category,
          featured: project.featured
        })
      } else {
        setError('Project not found')
      }
    } catch (err) {
      setError('Failed to fetch project')
      console.error('Error fetching project:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddTechnology = () => {
    if (technologyInput.trim() && !formData.technologies.includes(technologyInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, technologyInput.trim()]
      }))
      setTechnologyInput('')
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.description || !formData.longDescription || !formData.category) {
      setError('Please fill in all required fields')
      return
    }

    if (formData.technologies.length === 0) {
      setError('Please add at least one technology')
      return
    }

    try {
      setLoading(true)
      setError('')

      const projectData = {
        ...formData,
        imageUrl: formData.imageUrl || null,
        demoUrl: formData.demoUrl || null,
        githubUrl: formData.githubUrl || null
      }

      if (isEdit && projectId) {
        await updateProject(projectId, projectData)
      } else {
        await createProject(projectData)
      }

      router.push('/admin/projects')
    } catch (err) {
      setError(isEdit ? 'Failed to update project' : 'Failed to create project')
      console.error('Error saving project:', err)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Frontend',
    'Backend',
    'Full Stack',
    'Mobile',
    'Desktop',
    'DevOps',
    'Design',
    'Other'
  ]

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          {isEdit ? 'Edit Project' : 'New Project'}
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter project title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Description *
            </label>
            <textarea
              name="description"
              id="description"
              rows={2}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Brief description for project cards"
            />
          </div>

          {/* Long Description */}
          <div>
            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Long Description *
            </label>
            <textarea
              name="longDescription"
              id="longDescription"
              rows={4}
              required
              value={formData.longDescription}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Detailed description for project page"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              name="category"
              id="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Technologies */}
          <div>
            <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technologies *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={technologyInput}
                onChange={(e) => setTechnologyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTechnology())}
                className="flex-1 rounded-l-md border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter technology name"
              />
              <button
                type="button"
                onClick={handleAddTechnology}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 sm:text-sm"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTechnology(tech)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Demo URL
              </label>
              <input
                type="url"
                name="demoUrl"
                id="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="https://demo.example.com"
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                id="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Featured project (will appear on homepage)
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
        </button>
      </div>
    </form>
  )
}