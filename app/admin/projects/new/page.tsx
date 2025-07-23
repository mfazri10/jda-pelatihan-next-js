import ProjectForm from '../components/ProjectForm'

export default function NewProject() {
  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Add New Project</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Create a new project for your portfolio.
          </p>
        </div>
      </div>

      <ProjectForm />
    </div>
  )
}