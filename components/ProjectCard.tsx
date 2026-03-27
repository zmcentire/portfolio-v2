'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { type Project, statusConfig } from '@/lib/data'
import { ARCH_DIAGRAMS } from '@/components/ArchDiagram'

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen]          = useState(false)
  const [diagramOpen, setDiagramOpen] = useState(false)
  const status = statusConfig[project.status]
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Stable IDs for aria-labelledby / aria-controls
  const headingId   = `project-title-${project.id}`
  const caseStudyId = `case-study-${project.id}`

  return (
    /*  <article> is the correct element for a self-contained, independently
        meaningful content unit. Each project card can stand alone and makes
        sense without surrounding context — it has its own heading, metadata,
        and actions. The AT tree exposes it as an "article" landmark.

        aria-labelledby points to the visible project title (h2 below),
        giving the article a meaningful accessible name. Screen readers
        announce: "TigerData Fitness Tracker, article" when navigating
        by article landmarks.

        Note: we removed role="listitem" here because the parent <li>
        in projects/page.tsx already provides that semantic role.
        Nesting role="listitem" inside a <li> would be redundant. */
    <article
      aria-labelledby={headingId}
      className={`project-card${open ? ' project-card--open' : ''}`}
    >
      {/* Project image — aria-hidden: decorative, h2 already names the project.
          .project-img-wrap handles base filter, scanline overlay, and the
          clip-path glitch animation via CSS ::before / ::after + .glitch-crimson. */}
      <div aria-hidden="true" className="project-img-wrap" style={{ position: 'relative' }}>
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        {/* Crimson RGB-split layer — offset opposite to the cyan ::after */}
        <div className="glitch-crimson" />
        {/* Gradient fade into card body */}
        <div className="project-img-overlay" />
      </div>

      {/* Card body */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            {/* h2 — correct heading level: page h1 > card h2.
                id matches aria-labelledby on the <article> above.
                .project-card__title receives the RGB-split animation on
                card hover via the CSS sibling selector. */}
            <h2
              id={headingId}
              className="project-card__title"
            >
              {project.title}
            </h2>
            {/* Tagline — <p> subordinate to the h2, not a heading */}
            <p style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              color:         'var(--color-text-secondary)',
              letterSpacing: '0.04em',
              margin:        '4px 0 0',
            }}>
              {project.tagline}
            </p>
          </div>

          {/* Status badge.
              role="status" would be wrong here — that's for live regions.
              aria-label provides the full readable status to AT since
              the visual label alone ("Live") lacks context. */}
          <span
            aria-label={`Project status: ${status.label}`}
            className={`pill pill--${project.status === 'live' ? 'cyan' : project.status === 'issue' ? 'crimson' : 'brass'}`}
          >
            {status.label}
          </span>
        </div>

        {/* Status note — <p> with role="note" signals supplementary info to AT */}
        {project.statusNote && (
          <p role="note" style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px',
            color:         'var(--color-accent-brass)',
            margin:        0,
            letterSpacing: '0.02em',
          }}>
            {project.statusNote}
          </p>
        )}

        {/* Tech stack — <ul> with descriptive aria-label */}
        <ul
          aria-label={`Technologies used in ${project.title}`}
          style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}
        >
          {project.stack.map((tech) => (
            <li key={tech} className="tag">{tech}</li>
          ))}
        </ul>

        {/* Description — plain <p> */}
        <p className="type-body" style={{ fontSize: '13px', lineHeight: '1.7', margin: 0 }}>
          {project.description}
        </p>

        {/* Case study toggle button.
            - type="button" prevents accidental form submission
            - aria-expanded communicates open/closed to AT
            - aria-controls points to the controlled region by id
            AT users hear: "View case study, collapsed, button"
            When open: "Hide case study, expanded, button" */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={caseStudyId}
          className="btn btn--ghost"
          style={{ padding: '8px 14px', fontSize: '11px', alignSelf: 'flex-start' }}
        >
          {open ? '− Hide case study' : '+ View case study'}
        </button>

        {/* Case study drawer.
            id matches aria-controls on the button above.
            role="region" with aria-label makes it a named landmark
            when expanded — AT users can jump here from the landmarks menu.
            Hidden via conditional render (equivalent to hidden attribute). */}
        {open && (
          <section
            id={caseStudyId}
            aria-label={`${project.title} case study`}
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Highlights */}
            <div>
              {/* h3 — third heading level: page h1 > card h2 > drawer h3 */}
              <h3 style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'var(--color-accent-brass)',
                marginBottom:  '10px',
                fontWeight:    '500',
              }}>
                {/* Prefix glyph is decorative */}
                <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                Highlights
              </h3>
              <ul
                aria-label="Project highlights"
                style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {project.highlights.map((h) => (
                  <li key={h} style={{
                    fontFamily:  'var(--font-mono)',
                    fontSize:    '12px',
                    color:       'var(--color-text-secondary)',
                    lineHeight:  '1.5',
                    display:     'flex',
                    alignItems:  'flex-start',
                    gap:         '8px',
                  }}>
                    {/* Bullet glyph — decorative */}
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-cyan)', flexShrink: 0 }}>▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture diagram — thumbnail opens a <dialog> fullscreen modal.
                <dialog> provides native focus trapping, Escape-to-close, and
                the correct `role="dialog"` + `aria-modal` semantics for free. */}
            {ARCH_DIAGRAMS[project.id] && (() => {
              const Diagram = ARCH_DIAGRAMS[project.id]
              return (
                <div>
                  <h3 style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         'var(--color-accent-brass)',
                    marginBottom:  '12px',
                    fontWeight:    '500',
                  }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                    Architecture
                  </h3>

                  {/* Clickable thumbnail */}
                  <button
                    type="button"
                    onClick={() => {
                      setDiagramOpen(true)
                      dialogRef.current?.showModal()
                    }}
                    aria-label={`Expand ${project.title} architecture diagram`}
                    style={{
                      display:    'block',
                      width:      '100%',
                      padding:    0,
                      border:     '1px solid var(--color-border)',
                      borderRadius: '2px',
                      background: 'none',
                      cursor:     'zoom-in',
                      overflow:   'hidden',
                      position:   'relative',
                    }}
                  >
                    <Diagram />
                    {/* Expand hint overlay */}
                    <div style={{
                      position:   'absolute',
                      bottom:     8,
                      right:      8,
                      background: 'rgba(13,13,15,0.85)',
                      border:     '1px solid var(--color-border)',
                      borderRadius: '2px',
                      padding:    '3px 8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '9px',
                      letterSpacing: '0.10em',
                      color:      'var(--color-text-secondary)',
                      textTransform: 'uppercase',
                      pointerEvents: 'none',
                    }}>
                      ⤢ Expand
                    </div>
                  </button>

                  {/* Native <dialog> — handles focus trap + Escape natively */}
                  <dialog
                    ref={dialogRef}
                    aria-label={`${project.title} architecture diagram, fullscreen`}
                    onClick={(e) => {
                      // Click outside the inner panel closes the dialog
                      if (e.target === dialogRef.current) {
                        dialogRef.current?.close()
                        setDiagramOpen(false)
                      }
                    }}
                    onClose={() => setDiagramOpen(false)}
                    style={{
                      position:   'fixed',
                      inset:      0,
                      margin:     'auto',
                      width:      'min(92vw, 1000px)',
                      maxHeight:  '90vh',
                      background: 'var(--color-bg-surface)',
                      border:     '1px solid var(--color-border-glow)',
                      borderRadius: '2px',
                      padding:    0,
                      overflow:   'hidden',
                    }}
                  >
                    {/* Modal header */}
                    <div style={{
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'space-between',
                      padding:        '12px 16px',
                      borderBottom:   '1px solid var(--color-border)',
                      background:     'var(--color-bg-surface)',
                    }}>
                      <p style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '10px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color:         'var(--color-accent-brass)',
                        margin:        0,
                      }}>
                        <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                        {project.title} — Architecture
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          dialogRef.current?.close()
                          setDiagramOpen(false)
                        }}
                        aria-label="Close architecture diagram"
                        style={{
                          background:    'none',
                          border:        '1px solid var(--color-border)',
                          borderRadius:  '2px',
                          color:         'var(--color-text-secondary)',
                          fontFamily:    'var(--font-mono)',
                          fontSize:      '11px',
                          padding:       '4px 10px',
                          cursor:        'pointer',
                          lineHeight:    1,
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Full-size diagram */}
                    <div style={{
                      padding:    '24px',
                      overflow:   'auto',
                      maxHeight:  'calc(90vh - 50px)',
                    }}>
                      <Diagram />
                    </div>
                  </dialog>
                </div>
              )
            })()}

            {/* Engineering challenges */}
            <div>
              <h3 style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'var(--color-accent-brass)',
                marginBottom:  '10px',
                fontWeight:    '500',
              }}>
                <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                Engineering challenges
              </h3>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize:   '12px',
                lineHeight: '1.75',
                color:      'var(--color-text-secondary)',
                margin:     0,
              }}>
                {project.challenges}
              </p>
            </div>

            {/* Planned iterations — only rendered when data exists */}
            {project.future && project.future.length > 0 && (
              <div>
                <h3 style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         'var(--color-accent-brass)',
                  marginBottom:  '10px',
                  fontWeight:    '500',
                }}>
                  <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                  Planned iterations
                </h3>
                <ul
                  aria-label="Planned features"
                  style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  {project.future.map((f) => (
                    <li key={f} style={{
                      fontFamily:  'var(--font-mono)',
                      fontSize:    '12px',
                      color:       'var(--color-text-secondary)',
                      lineHeight:  '1.5',
                      display:     'flex',
                      alignItems:  'flex-start',
                      gap:         '8px',
                    }}>
                      <span aria-hidden="true" style={{ color: 'var(--color-accent-brass)', flexShrink: 0 }}>◈</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Action buttons */}
        <div
          aria-label={`Links for ${project.title}`}
          style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px', flexWrap: 'wrap' }}
        >
          {/* Case study link — always present, primary CTA */}
          <Link
            href={`/projects/${project.id}`}
            aria-label={`Read ${project.title} case study`}
            className="btn btn--primary"
            style={{ padding: '9px 14px', fontSize: '11px' }}
          >
            Case Study →
          </Link>

          {project.demo && project.status === 'live' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo, opens in new tab`}
              className="btn btn--secondary"
              style={{ padding: '9px 14px', fontSize: '11px' }}
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
              style={{ padding: '9px 14px', fontSize: '11px' }}
            >
              Code ↗
            </a>
          )}
        </div>

      </div>
    </article>
  )
}