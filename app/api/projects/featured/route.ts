import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/projects/featured - Get only featured projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        featured: true
      },
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
    console.error('Error fetching featured projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured projects' },
      { status: 500 }
    )
  }
}