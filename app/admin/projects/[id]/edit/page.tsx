import ProjectForm from '../../components/ProjectForm'

interface EditProjectProps {
  params: {
    id: string
  }
}

export default function EditProject({ params }: EditProjectProps) {
  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Edit Project</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Update your project information.
          </p>
        </div>
      </div>

      <ProjectForm projectId={params.id} isEdit={true} />
    </div>
  )
}