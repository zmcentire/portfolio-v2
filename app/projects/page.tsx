import type { Metadata } from 'next'
import { projects } from '@/lib/data'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = {
  title:       'Projects',
  description: 'Full-stack and AI projects — TigerData agentic fitness tracker, HotZone field resource app, Poly Platform, and more. Built with React, Next.js, Python, FastAPI, and the Claude API.',
  alternates:  { canonical: 'https://zachmcentire.dev/projects' },
  openGraph: {
    title:       'Projects — Zach McEntire',
    description: 'Agentic AI systems, cloud-native apps, and support tooling. TigerData, HotZone, Poly Platform, and more.',
    url:         'https://zachmcentire.dev/projects',
  },
  twitter: {
    title:       'Projects — Zach McEntire',
    description: 'Agentic AI systems, cloud-native apps, and support tooling. TigerData, HotZone, Poly Platform, and more.',
  },
}

export default function ProjectsPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* Page header — <header> inside a sectioning element (not the
            top-level <body>) does NOT carry role="banner". It is just
            a semantic grouping for the section's heading content. */}
        <header style={{ marginBottom: '48px' }}>
          <p className="type-eyebrow fade-up fade-up-1" style={{ marginBottom: '8px' }}>
            <span className="accent" aria-hidden="true">// </span>Selected Work
          </p>
          {/* h1 — one per page */}
          <h1 id="projects-heading" className="type-h1 fade-up fade-up-2">
            Projects
          </h1>
        </header>

        {/* ── Projects grid ─────────────────────────────────────────────────
            <section aria-labelledby> wraps the grid as a named region.
            role="list" restores list semantics on the CSS grid container.
            Each ProjectCard renders an <article role="listitem"> inside.
        ──────────────────────────────────────────────────────────────── */}
        <section aria-labelledby="projects-heading">
          <ul
            role="list"
            className="grid-projects"
            style={{ listStyle: 'none' }}
          >
            {projects.map((project, i) => (
              // <li> pairs semantically with the <ul> above.
              // The fade-up delay staggers the entrance animation.
              <li
                key={project.id}
                className={`fade-up fade-up-${Math.min(i + 1, 5)}`}
              >
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </section>

      </div>
    </>
  )
}