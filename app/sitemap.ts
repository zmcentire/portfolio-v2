import { MetadataRoute } from 'next'
import { projects } from '@/lib/data'

const SITE = 'https://zachmcentire.dev'

// Next.js generates /sitemap.xml from this file at build time.
// Priority and changeFrequency are hints to crawlers — not enforced.
// Home page is highest priority; project case studies are second;
// supporting pages (about, support) are third.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url:             SITE,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        1.0,
    },
    {
      url:             `${SITE}/about`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    {
      url:             `${SITE}/projects`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,
    },
    {
      url:             `${SITE}/support`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.7,
    },
  ]

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url:             `${SITE}/projects/${project.id}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }))

  return [...staticRoutes, ...projectRoutes]
}