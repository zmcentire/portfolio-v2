// ─── Shared site constants ────────────────────────────────────────────────────
// Single source of truth for URLs used across multiple components.
// Change once here rather than hunting through every file.

// Resume PDF — served directly from /public so it's available at this path
// with no redirect, no Google Drive login requirement, and a proper
// Content-Disposition: attachment header from Next.js static serving.
// Replace the file at public/zach-mcentire-resume.pdf when you update it.
export const RESUME_URL    = '/zach-mcentire-resume.pdf'
export const RESUME_LABEL  = 'Zach McEntire — Full-Stack & AI Engineer Resume'

// Social / contact
export const GITHUB_URL    = 'https://github.com/zmcentire'
export const LINKEDIN_URL  = 'https://www.linkedin.com/in/zachmcentire/'
export const EMAIL         = 'zmcentire@gmail.com'

// Canonical site URL (used in OG tags etc.)
export const SITE_URL      = 'https://zachmcentire.dev'