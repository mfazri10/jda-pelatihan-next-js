import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse technologies JSON
    const projectWithParsedTechnologies = {
      ...project,
      technologies: JSON.parse(project.technologies)
    }

    return NextResponse.json(projectWithParsedTechnologies)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      longDescription,
      technologies,
      imageUrl,
      demoUrl,
      githubUrl,
      category,
      featured
    } = body

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const project = await prisma.project.update({
      where: {
        id: params.id
      },
      data: {
        title,
        description,
        longDescription,
        technologies: JSON.stringify(technologies),
        imageUrl: imageUrl || null,
        demoUrl: demoUrl || null,
        githubUrl: githubUrl || null,
        category,
        featured: featured || false
      }
    })

    // Parse technologies back to array for response
    const projectWithParsedTechnologies = {
      ...project,
      technologies: JSON.parse(project.technologies)
    }

    return NextResponse.json(projectWithParsedTechnologies)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: {
        id: params.id
      }
    })

    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}