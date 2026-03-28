import { MetadataRoute } from 'next'

const SITE = 'https://zachmcentire.dev'

// Next.js generates /robots.txt from this file at build time.
// Allow all crawlers on all routes; point to the sitemap.
// The /api/ route is excluded — no need to index API endpoints.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:     '/',
        disallow:  '/api/',
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  }
}