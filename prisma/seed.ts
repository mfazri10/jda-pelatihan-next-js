import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform with shopping cart and payment integration",
    longDescription: "A full-stack e-commerce platform built with Next.js and React. Features include user authentication, product catalog, shopping cart functionality, order management, and payment integration with Stripe. The platform also includes an admin dashboard for managing products and orders. Built with a focus on performance and user experience.",
    technologies: JSON.stringify(["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB", "Node.js"]),
    imageUrl: "/projects/ecommerce.jpg",
    demoUrl: "https://ecommerce-demo.example.com",
    githubUrl: "https://github.com/username/ecommerce-platform",
    category: "Full Stack",
    featured: true
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates",
    longDescription: "A collaborative task management application that allows teams to organize, track, and manage their work efficiently. Features include real-time updates, drag-and-drop functionality, team collaboration, file attachments, and detailed project analytics. Built with modern web technologies and optimized for both desktop and mobile use.",
    technologies: JSON.stringify(["React", "Node.js", "Socket.io", "MongoDB", "Express", "Tailwind CSS"]),
    imageUrl: "/projects/task-management.jpg",
    demoUrl: "https://taskapp-demo.example.com",
    githubUrl: "https://github.com/username/task-management",
    category: "Full Stack",
    featured: true
  },
  {
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location-based forecasts",
    longDescription: "A comprehensive weather dashboard that provides real-time weather information and forecasts for any location. Features include current weather conditions, 7-day forecasts, weather maps, favorite locations, and weather alerts. The application uses multiple weather APIs and includes data visualization with charts and graphs.",
    technologies: JSON.stringify(["React", "TypeScript", "Chart.js", "Weather API", "Tailwind CSS", "Next.js"]),
    imageUrl: "/projects/weather-dashboard.jpg",
    demoUrl: "https://weather-demo.example.com",
    githubUrl: "https://github.com/username/weather-dashboard",
    category: "Frontend",
    featured: true
  },
  {
    title: "Blog Content Management System",
    description: "A headless CMS for managing blog content with rich text editor",
    longDescription: "A modern headless CMS built specifically for bloggers and content creators. Features include a rich text editor, media management, SEO optimization, comment system, user roles and permissions, and analytics dashboard. The system supports multiple content types and can be easily integrated with any frontend framework.",
    technologies: JSON.stringify(["Next.js", "React", "Prisma", "PostgreSQL", "Tailwind CSS", "TypeScript"]),
    imageUrl: "/projects/blog-cms.jpg",
    demoUrl: "https://blog-cms-demo.example.com",
    githubUrl: "https://github.com/username/blog-cms",
    category: "Full Stack",
    featured: false
  },
  {
    title: "Portfolio Website",
    description: "A modern portfolio website with smooth animations and responsive design",
    longDescription: "A personal portfolio website showcasing projects, skills, and experience. Built with modern web technologies and featuring smooth animations, responsive design, dark mode support, and optimized performance. The site includes a blog section, contact form, and project showcase with detailed case studies.",
    technologies: JSON.stringify(["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"]),
    imageUrl: "/projects/portfolio.jpg",
    demoUrl: "https://portfolio-demo.example.com",
    githubUrl: "https://github.com/username/portfolio",
    category: "Frontend",
    featured: false
  }
]

async function main() {
  console.log('Start seeding...')
  
  // Clear existing data
  await prisma.project.deleteMany({})
  
  // Insert seed data
  for (const project of projects) {
    const result = await prisma.project.create({
      data: project
    })
    console.log(`Created project with id: ${result.id}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })