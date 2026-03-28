import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import HeroSceneLoader from '@/components/HeroSceneLoader'
import { RESUME_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title:       'Zach McEntire — Full-Stack & AI Engineer',
  description: 'Full-Stack & AI Engineer — agentic systems, cloud-native APIs, and the support tooling that keeps them running. Available for new roles.',
  alternates:  { canonical: 'https://zachmcentire.dev' },
  openGraph: {
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack & AI Engineer — agentic systems, cloud-native APIs, and the support tooling that keeps them running.',
    url:         'https://zachmcentire.dev',
  },
  twitter: {
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack & AI Engineer — agentic systems, cloud-native APIs, and the support tooling that keeps them running.',
  },
}

const roles = [
  'Full-Stack Engineer',
  'AI & Agentic Systems',
  'Support Engineering',
]

const techPills = [
  'React', 'Next.js', 'Python', 'FastAPI',
  'Claude API', 'TimescaleDB', 'Railway', 'Vercel',
]

const stats = [
  { value: '5+', label: 'Years in tech'         },
  { value: '7',  label: 'Projects shipped'      },
  { value: '4',  label: 'Deploy platforms'      },
  { value: '2',  label: 'Agentic apps in prod'  },
]

export default function HomePage() {
  return (
    <>
      {/* Atmospheric overlays — aria-hidden removes from AT tree */}
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette"  aria-hidden="true" />

      {/* Three.js particle field — fixed behind all content.
          HeroSceneLoader handles SSR exclusion, WebGL capability
          check, and prefers-reduced-motion fallback automatically.
          Falls back to the CSS glow blobs below if WebGL unavailable. */}
      <HeroSceneLoader />

      {/* CSS fallback glow — visible when Three.js doesn't load.
          When Three.js IS active, these sit behind the canvas
          at z-index 0 and are invisible but harmless. */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="glow-blob glow-blob--crimson" style={{ top: '-20%', left: '-10%', width: '600px', height: '600px' }} />
        <div className="glow-blob glow-blob--cyan"    style={{ bottom: '-10%', right: '-5%', width: '500px', height: '500px' }} />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        style={{
          position:   'relative',
          zIndex:     1,
          minHeight:  'calc(100vh - 56px)',
          display:    'flex',
          alignItems: 'center',
          maxWidth:   '1100px',
          margin:     '0 auto',
          padding:    '80px 24px 60px',
          gap:        '64px',
          flexWrap:   'wrap',
        }}
      >
        {/* Text block */}
        <div style={{ flex: '1 1 400px' }}>
          <p className="type-prompt fade-up fade-up-1" style={{ marginBottom: '16px' }}>
            <span aria-hidden="true">{'> '}</span>Available for new roles · Salt Lake City / Remote
          </p>

          <h1
            id="hero-heading"
            className="type-display fade-up fade-up-2"
            style={{ marginBottom: '8px' }}
          >
            Zach
            <br />
            <span className="type-dim">McEntire</span>
          </h1>

          <ul
            role="list"
            aria-label="Specializations"
            className="fade-up fade-up-3"
            style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0 28px' }}
          >
            {roles.map((role, i) => (
              <li key={role} className={`pill${i === 0 ? ' pill--cyan' : ''}`}>{role}</li>
            ))}
          </ul>

          <p
            className="type-body fade-up fade-up-3"
            style={{ maxWidth: '540px', marginBottom: '16px', fontSize: '15px', lineHeight: '1.8' }}
          >
            Full-Stack &amp; AI Engineer. I build agentic systems, cloud-native apps,
            and the tooling that keeps them running — then support the engineers who depend on them.
          </p>
          <p
            className="type-body fade-up fade-up-3"
            style={{ maxWidth: '540px', marginBottom: '32px', fontSize: '13px' }}
          >
            5+ years spanning full-stack product work, Technical Account Management,
            and agentic AI systems. Currently shipping in React, Next.js, Python, FastAPI,
            and the Claude API.
          </p>

          {/* Tech pills — secondary signal row */}
          <ul
            role="list"
            aria-label="Core technologies"
            className="fade-up fade-up-3"
            style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '36px' }}
          >
            {techPills.map((t) => (
              <li key={t} style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.08em',
                color:         'var(--color-text-tertiary)',
                padding:       '3px 8px',
                border:        '1px solid var(--color-border)',
                borderRadius:  '2px',
                background:    'var(--color-bg-surface)',
              }}>{t}</li>
            ))}
          </ul>

          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/projects" className="btn btn--primary" style={{ padding: '11px 22px', fontSize: '12px' }}>
              Projects ↗
            </Link>
            <Link href="/about" className="btn btn--secondary" style={{ padding: '11px 22px', fontSize: '12px' }}>
              About
            </Link>
            <Link href="/support" className="btn btn--secondary" style={{ padding: '11px 22px', fontSize: '12px' }}>
              Support
            </Link>
            <a
              href={RESUME_URL}
              download="zach-mcentire-resume.pdf"
              aria-label="Download resume PDF"
              className="btn btn--ghost"
              style={{ padding: '11px 22px', fontSize: '12px' }}
            >
              ↓ Resume
            </a>
          </div>

          <nav aria-label="Social profiles" className="fade-up fade-up-5" style={{ marginTop: '40px' }}>
            <ul role="list" style={{ listStyle: 'none', display: 'flex', gap: '20px' }}>
              {[
                { href: 'https://github.com/zmcentire',              label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/zachmcentire/', label: 'LinkedIn' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} profile, opens in new tab`}
                    className="link-muted"
                  >
                    {label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Headshot */}
        <figure className="fade-up fade-up-3" style={{ position: 'relative', flexShrink: 0, margin: 0 }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: '-3px', borderRadius: '4px',
              boxShadow: 'var(--glow-cyan)', zIndex: 0,
            }}
          />
          <Image
            src="/images/Headshot.jpeg"
            alt="Zach McEntire, Full-Stack and AI Engineer"
            width={260}
            height={320}
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR42mMQFpECAAB/AEJqxrfGAAAAAElFTkSuQmCC"
            sizes="(max-width: 640px) 220px, 260px"
            style={{
              objectFit:      'cover',
              objectPosition: 'center top',
              borderRadius:   '2px',
              border:         '1px solid var(--color-border)',
              filter:         'saturate(0.8) contrast(1.05)',
              position:       'relative',
              zIndex:         1,
              display:        'block',
            }}
          />
          {([
            { top: -6,    left: -6  },
            { top: -6,    right: -6 },
            { bottom: -6, left: -6  },
            { bottom: -6, right: -6 },
          ] as const).map((pos, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                position:    'absolute',
                ...pos,
                width:       '12px',
                height:      '12px',
                borderTop:    i < 2  ? '2px solid var(--color-accent-cyan)' : undefined,
                borderBottom: i >= 2 ? '2px solid var(--color-accent-cyan)' : undefined,
                borderLeft:   i % 2 === 0 ? '2px solid var(--color-accent-cyan)' : undefined,
                borderRight:  i % 2 !== 0 ? '2px solid var(--color-accent-cyan)' : undefined,
                zIndex: 2,
              }}
            />
          ))}
          <figcaption className="sr-only">Portrait photograph of Zach McEntire</figcaption>
        </figure>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="stats-heading"
        style={{
          position:     'relative',
          zIndex:       1,
          borderTop:    '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          background:   'var(--color-bg-surface)',
        }}
      >
        <h2 id="stats-heading" className="sr-only">At a glance</h2>
        <dl
          style={{
            maxWidth:            '1100px',
            margin:              '0 auto',
            padding:             '32px 24px',
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap:                 '32px',
          }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <dt className="type-h2" style={{ color: 'var(--color-accent-cyan)', lineHeight: 1, marginBottom: '6px' }}>
                {value}
              </dt>
              <dd className="type-label" style={{ color: 'var(--color-text-secondary)' }}>
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}