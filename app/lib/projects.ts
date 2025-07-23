export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string | null;
  demoUrl?: string | null;
  githubUrl?: string | null;
  category: string;
  featured: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Fetch projects from API
export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects/featured`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured projects');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects/${id}`, {
      cache: 'no-store' // Ensure fresh data
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export function getProjectsByCategory(projects: Project[], category: string): Project[] {
  return projects.filter(project => project.category === category);
}

// Client-side project operations
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to create project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    return null;
  }
}

export async function updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });

    if (!response.ok) {
      throw new Error('Failed to update project');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete project');
    }

    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}