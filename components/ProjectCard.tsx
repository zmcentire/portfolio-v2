'use client'

import { useState } from 'react'
import Image from 'next/image'
import { type Project, statusConfig } from '@/lib/data'

export default function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false)
  const status = statusConfig[project.status]

  return (
    <article
      aria-label={project.title}
      style={{
        background:    'var(--surface)',
        border:        `1px solid ${open ? 'rgba(0,229,255,0.25)' : 'var(--border)'}`,
        borderRadius:  '2px',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        transition:    'border-color 0.2s',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }} aria-hidden="true">
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
          style={{
            objectFit:  'cover',
            filter:     'saturate(0.25) contrast(1.2) brightness(0.65)',
            transition: 'filter 0.3s',
          }}
        />
        <div style={{
          position:   'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, var(--surface) 100%)',
        }} />
      </div>

      {/* Body */}
      <div style={{
        padding: '20px', flex: 1,
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '16px',
              fontWeight: '600', color: 'var(--text-1)', margin: 0, lineHeight: 1.3,
            }}>
              {project.title}
            </h2>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px',
              color: 'var(--text-2)', letterSpacing: '0.04em', margin: '4px 0 0',
            }}>
              {project.tagline}
            </p>
          </div>
          <span
            aria-label={`Status: ${status.label}`}
            style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '10px', fontWeight: '500',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding:       '3px 8px', borderRadius: '2px',
              whiteSpace:    'nowrap', flexShrink: 0,
              color:         status.color,
              background:    status.bg,
              border:        `1px solid ${status.border}`,
            }}
          >
            {status.label}
          </span>
        </div>

        {project.statusNote && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px',
            color: 'var(--brass)', margin: 0, letterSpacing: '0.02em',
          }}>
            {project.statusNote}
          </p>
        )}

        {/* Stack pills */}
        <ul aria-label="Technologies used" style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {project.stack.map((tech) => (
            <li key={tech} style={{
              fontFamily: 'var(--font-mono)', fontSize: '10px',
              padding: '3px 8px', background: 'var(--surface-2)',
              border: '1px solid var(--border)', borderRadius: '2px',
              color: 'var(--text-2)', letterSpacing: '0.03em',
            }}>
              {tech}
            </li>
          ))}
        </ul>

        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          lineHeight: '1.7', color: 'var(--text-2)', margin: 0,
        }}>
          {project.description}
        </p>

        {/* Expand button */}
        <button
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls={`case-study-${project.id}`}
          style={{
            background:    'none',
            border:        '1px solid var(--border)',
            borderLeft:    '3px solid var(--crimson)',
            color:         'var(--text-2)',
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px', letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '8px 14px',
            cursor:        'pointer', borderRadius: '2px',
            textAlign:     'left', alignSelf: 'flex-start',
            transition:    'color 0.2s, border-color 0.2s',
          }}
        >
          {open ? '− Hide case study' : '+ View case study'}
        </button>

        {/* Case study drawer */}
        {open && (
          <div
            id={`case-study-${project.id}`}
            style={{
              borderTop: '1px solid var(--border)', paddingTop: '16px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}
          >
            {/* Highlights */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--brass)', marginBottom: '10px', fontWeight: '500',
              }}>
                <span style={{ color: 'var(--crimson-lt)' }}>{'> '}</span>Highlights
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {project.highlights.map((h) => (
                  <li key={h} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    color: 'var(--text-2)', lineHeight: '1.5',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                  }}>
                    <span aria-hidden="true" style={{ color: 'var(--cyan)', flexShrink: 0 }}>▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h3 style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--brass)', marginBottom: '10px', fontWeight: '500',
              }}>
                <span style={{ color: 'var(--crimson-lt)' }}>{'> '}</span>Engineering challenges
              </h3>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px',
                lineHeight: '1.75', color: 'var(--text-2)', margin: 0,
              }}>
                {project.challenges}
              </p>
            </div>

            {/* Future */}
            {project.future && project.future.length > 0 && (
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--brass)', marginBottom: '10px', fontWeight: '500',
                }}>
                  <span style={{ color: 'var(--crimson-lt)' }}>{'> '}</span>Planned iterations
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {project.future.map((f) => (
                    <li key={f} style={{
                      fontFamily: 'var(--font-mono)', fontSize: '12px',
                      color: 'var(--text-2)', lineHeight: '1.5',
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                    }}>
                      <span aria-hidden="true" style={{ color: 'var(--brass)', flexShrink: 0 }}>◈</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div
          role="group"
          aria-label={`Links for ${project.title}`}
          style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '4px', flexWrap: 'wrap' }}
        >
          {project.demo && project.status === 'live' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px', fontWeight: '700',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding:       '9px 18px', background: 'var(--cyan)',
                color:         'var(--obsidian)', borderRadius: '2px',
              }}
            >
              Live Demo ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px', letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '9px 16px',
                border:        '1px solid var(--border)', color: 'var(--text-2)',
                borderRadius:  '2px',
              }}
            >
              View Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
