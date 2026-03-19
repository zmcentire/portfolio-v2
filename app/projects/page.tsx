import type { Metadata } from 'next'
import { projects } from '@/lib/data'
import ProjectCard from '@/components/ProjectCard'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Full-stack projects spanning AI agents, cloud-native APIs, React applications, and Firebase deployments.',
}

export default function ProjectsPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '48px' }}>
          <p className="section-eyebrow fade-up fade-up-1">
            <span className="accent">// </span>Selected Work
          </p>
          <h1 className="section-title fade-up fade-up-2">Projects</h1>
        </header>

        <div
          role="list"
          style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap:                 '20px',
          }}
        >
          {projects.map((project) => (
            <div key={project.id} role="listitem" className="fade-up fade-up-3">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
