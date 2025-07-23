import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/projects - Get all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    // Parse technologies JSON for each project
    const projectsWithParsedTechnologies = projects.map(project => ({
      ...project,
      technologies: JSON.parse(project.technologies)
    }))
    
    return NextResponse.json(projectsWithParsedTechnologies)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
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

    // Validate required fields
    if (!title || !description || !longDescription || !technologies || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
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

    return NextResponse.json(projectWithParsedTechnologies, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}