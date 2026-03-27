import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { projects, statusConfig } from '@/lib/data'
import { ARCH_DIAGRAMS } from '@/components/ArchDiagram'

// ─── Static generation ────────────────────────────────────────────────────────
// Pre-renders a page for every project at build time.
// No server-side rendering, no dynamic data fetching at runtime.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }))
}

// ─── Per-page metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = projects.find((p) => p.id === params.slug)
  if (!project) return { title: 'Project not found' }
  return {
    title:       `${project.title} — Case Study`,
    description: project.description,
    openGraph: {
      title:       `${project.title} — Case Study | Zach McEntire`,
      description: project.description,
      images:      [{ url: project.image }],
    },
  }
}

// ─── Section heading component ────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily:    'var(--font-mono)',
      fontSize:      '10px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         'var(--color-accent-brass)',
      marginBottom:  '14px',
      fontWeight:    '500',
      display:       'flex',
      alignItems:    'center',
      gap:           '6px',
    }}>
      <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
      {children}
    </h3>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectCaseStudyPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = projects.find((p) => p.id === params.slug)
  if (!project) notFound()

  const status   = statusConfig[project.status]
  const Diagram  = ARCH_DIAGRAMS[project.id]
  const study    = project.caseStudy

  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      <div
        className="page-container"
        style={{ position: 'relative', zIndex: 1, maxWidth: '1100px' }}
      >

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '40px' }}>
          <ol
            role="list"
            style={{
              listStyle:  'none',
              display:    'flex',
              alignItems: 'center',
              gap:        '8px',
              fontFamily: 'var(--font-mono)',
              fontSize:   '11px',
              letterSpacing: '0.08em',
            }}
          >
            <li>
              <Link
                href="/projects"
                style={{ color: 'var(--color-text-tertiary)', textDecoration: 'none' }}
                className="breadcrumb-link"
              >
                Projects
              </Link>
            </li>
            <li aria-hidden="true" style={{ color: 'var(--color-text-tertiary)' }}>{'/'}</li>
            <li aria-current="page" style={{ color: 'var(--color-text-secondary)' }}>
              {project.title}
            </li>
          </ol>
        </nav>

        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <header style={{ marginBottom: '56px' }}>
          {/* Project image — full-width banner with dramatic desaturation */}
          <div style={{
            position:     'relative',
            height:       '240px',
            overflow:     'hidden',
            borderRadius: '2px',
            marginBottom: '32px',
            border:       '1px solid var(--color-border)',
          }}>
            <Image
              src={project.image}
              alt=""
              fill
              priority
              style={{
                objectFit:  'cover',
                filter:     'grayscale(0.6) contrast(1.1) brightness(0.5) saturate(0.4)',
              }}
            />
            {/* Gradient — heavier at bottom so text reads against it */}
            <div aria-hidden="true" style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to bottom, rgba(13,13,15,0.1) 0%, rgba(13,13,15,0.85) 100%)',
            }} />
            {/* Title overlaid on the image */}
            <div style={{
              position: 'absolute',
              bottom:   '24px',
              left:     '28px',
              right:    '28px',
            }}>
              <p style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         'var(--color-accent-cyan)',
                marginBottom:  '8px',
              }}>
                <span aria-hidden="true">// </span>Case Study
              </p>
              <h1 style={{
                fontFamily:    'var(--font-display)',
                fontSize:      'clamp(24px, 4vw, 40px)',
                fontWeight:    '700',
                color:         'var(--color-text-primary)',
                lineHeight:    1.1,
                margin:        0,
                letterSpacing: '0.04em',
              }}>
                {project.title}
              </h1>
            </div>
          </div>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '15px',
            lineHeight: '1.7',
            color:      'var(--color-text-secondary)',
            maxWidth:   '720px',
          }}>
            {project.tagline}
          </p>
        </header>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div style={{
          display:   'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap:       '48px',
        }} className="case-study-grid">

          {/* ── Left sidebar ─────────────────────────────────────────────── */}
          <aside aria-label="Project metadata" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Status */}
            <div>
              <SectionHeading>Status</SectionHeading>
              <span style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           '6px',
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                fontWeight:    '500',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding:       '4px 10px',
                borderRadius:  '2px',
                color:         status.color,
                background:    status.bg,
                border:        `1px solid ${status.border}`,
              }}>
                <span aria-hidden="true" style={{
                  width:        '6px',
                  height:       '6px',
                  borderRadius: '50%',
                  background:   status.color,
                  boxShadow:    `0 0 6px ${status.color}`,
                  flexShrink:   0,
                }} />
                {status.label}
              </span>
              {project.statusNote && (
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '11px',
                  color:      'var(--color-accent-brass)',
                  marginTop:  '8px',
                }}>
                  {project.statusNote}
                </p>
              )}
            </div>

            {/* Metadata strip — role, duration, outcome */}
            {study && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Role',     value: study.role     },
                  { label: 'Duration', value: study.duration  },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '9px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color:         'var(--color-text-tertiary)',
                      marginBottom:  '4px',
                    }}>
                      {label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '13px',
                      color:      'var(--color-text-primary)',
                    }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Tech stack */}
            <div>
              <SectionHeading>Stack</SectionHeading>
              <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.stack.map((tech) => (
                  <li key={tech} className="tag">{tech}</li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.demo && project.status === 'live' && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} live demo, opens in new tab`}
                  className="btn btn--primary"
                  style={{ textAlign: 'center', padding: '10px', fontSize: '11px' }}
                >
                  Live Demo ↗
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} source code on GitHub, opens in new tab`}
                  className="btn btn--secondary"
                  style={{ textAlign: 'center', padding: '10px', fontSize: '11px' }}
                >
                  View Code ↗
                </a>
              )}
            </div>

            {/* Highlights */}
            <div>
              <SectionHeading>Highlights</SectionHeading>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.highlights.map((h) => (
                  <li key={h} style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '12px',
                    color:      'var(--color-text-secondary)',
                    lineHeight: '1.55',
                  }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-cyan)', flexShrink: 0 }}>▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Future iterations */}
            {project.future && project.future.length > 0 && (
              <div>
                <SectionHeading>Planned</SectionHeading>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {project.future.map((f) => (
                    <li key={f} style={{
                      display:    'flex',
                      alignItems: 'flex-start',
                      gap:        '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '12px',
                      color:      'var(--color-text-secondary)',
                      lineHeight: '1.55',
                    }}>
                      <span aria-hidden="true" style={{ color: 'var(--color-accent-brass)', flexShrink: 0 }}>◈</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </aside>

          {/* ── Main content ──────────────────────────────────────────────── */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

            {/* Outcome callout — if we have a case study */}
            {study && (
              <blockquote style={{
                margin:       0,
                padding:      '20px 24px',
                background:   'var(--color-bg-surface)',
                border:       '1px solid var(--color-border)',
                borderLeft:   '3px solid var(--color-accent-cyan)',
                borderRadius: '2px',
              }}>
                <p style={{
                  fontFamily:  'var(--font-mono)',
                  fontSize:    '14px',
                  lineHeight:  '1.75',
                  color:       'var(--color-text-primary)',
                  fontStyle:   'normal',
                  margin:      0,
                }}>
                  {study.outcome}
                </p>
              </blockquote>
            )}

            {/* Architecture diagram */}
            {Diagram && (
              <section aria-labelledby="arch-heading">
                <SectionHeading>Architecture</SectionHeading>
                <div style={{
                  border:       '1px solid var(--color-border)',
                  borderRadius: '2px',
                  overflow:     'hidden',
                }}>
                  <Diagram />
                </div>
                <p style={{
                  fontFamily:  'var(--font-mono)',
                  fontSize:    '11px',
                  color:       'var(--color-text-tertiary)',
                  marginTop:   '10px',
                  letterSpacing: '0.04em',
                }}>
                  Data flow from user interface through API layer to persistence and cloud deployment
                </p>
              </section>
            )}

            {/* Case study sections */}
            {study && study.sections.map((section, i) => (
              <section key={i} aria-labelledby={`section-${i}`}>
                <SectionHeading>{section.heading}</SectionHeading>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '14px',
                  lineHeight: '1.85',
                  color:      'var(--color-text-secondary)',
                  margin:     0,
                }}>
                  {section.body}
                </p>
                {section.items && (
                  <ul style={{
                    listStyle:   'none',
                    marginTop:   '16px',
                    display:     'flex',
                    flexDirection: 'column',
                    gap:         '8px',
                  }}>
                    {section.items.map((item) => (
                      <li key={item} style={{
                        display:    'flex',
                        alignItems: 'flex-start',
                        gap:        '10px',
                        fontFamily: 'var(--font-mono)',
                        fontSize:   '13px',
                        color:      'var(--color-text-secondary)',
                        lineHeight: '1.6',
                      }}>
                        <span aria-hidden="true" style={{
                          color:     'var(--color-accent-cyan)',
                          flexShrink: 0,
                          marginTop:  '1px',
                        }}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* No case study fallback */}
            {!study && (
              <section>
                <SectionHeading>About this project</SectionHeading>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '14px',
                  lineHeight: '1.85',
                  color:      'var(--color-text-secondary)',
                }}>
                  {project.description}
                </p>
                <div style={{ marginTop: '24px' }}>
                  <SectionHeading>Engineering challenges</SectionHeading>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '14px',
                    lineHeight: '1.85',
                    color:      'var(--color-text-secondary)',
                  }}>
                    {project.challenges}
                  </p>
                </div>
              </section>
            )}

          </main>
        </div>

        {/* ── Back nav ────────────────────────────────────────────────────── */}
        <div style={{
          marginTop:  '72px',
          paddingTop: '32px',
          borderTop:  '1px solid var(--color-border)',
          display:    'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap:   'wrap',
          gap:        '16px',
        }}>
          <Link
            href="/projects"
            className="btn btn--secondary"
            style={{ fontSize: '11px', padding: '10px 18px' }}
          >
            ← All Projects
          </Link>
          {/* Next project link */}
          {(() => {
            const idx  = projects.findIndex((p) => p.id === project.id)
            const next = projects[(idx + 1) % projects.length]
            return (
              <Link
                href={`/projects/${next.id}`}
                className="btn btn--secondary"
                style={{ fontSize: '11px', padding: '10px 18px' }}
              >
                {next.title} →
              </Link>
            )
          })()}
        </div>

      </div>

      <style>{`
        @media (min-width: 768px) {
          .case-study-grid {
            grid-template-columns: 260px minmax(0, 1fr) !important;
          }
        }
        .breadcrumb-link:hover {
          color: var(--color-text-secondary) !important;
        }
      `}</style>
    </>
  )
}