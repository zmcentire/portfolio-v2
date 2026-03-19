import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Zach McEntire — Full-Stack & AI Engineer',
}

const roles = [
  'Full-Stack Engineer',
  'AI & Agentic Systems',
  'Developer Experience',
  'Support Engineering',
]

export default function HomePage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      {/* Ambient glow blobs */}
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,26,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-5%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.05) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section
          aria-label="Introduction"
          style={{
            minHeight:      'calc(100vh - 56px)',
            display:        'flex',
            alignItems:     'center',
            maxWidth:       '1100px',
            margin:         '0 auto',
            padding:        '80px 24px 60px',
            gap:            '64px',
            flexWrap:       'wrap',
          }}
        >
          {/* Text block */}
          <div style={{ flex: '1 1 400px' }}>
            <p
              className="fade-up fade-up-1"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                letterSpacing: '0.20em',
                textTransform: 'uppercase',
                color:         'var(--cyan)',
                marginBottom:  '16px',
              }}
            >
              {'>'} Available for new roles
            </p>

            <h1
              className="fade-up fade-up-2"
              style={{
                fontFamily:   'var(--font-display)',
                fontSize:     'clamp(42px, 7vw, 72px)',
                fontWeight:   '700',
                lineHeight:   '1.05',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              Zach
              <br />
              <span style={{ color: 'var(--text-2)', fontWeight: '400' }}>McEntire</span>
            </h1>

            {/* Role tags */}
            <ul
              className="fade-up fade-up-3"
              role="list"
              aria-label="Specializations"
              style={{
                listStyle:    'none',
                display:      'flex',
                flexWrap:     'wrap',
                gap:          '8px',
                margin:       '20px 0 32px',
              }}
            >
              {roles.map((role) => (
                <li
                  key={role}
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    letterSpacing: '0.06em',
                    padding:       '5px 12px',
                    border:        '1px solid var(--border)',
                    borderRadius:  '2px',
                    color:         'var(--text-2)',
                    background:    'var(--surface)',
                  }}
                >
                  {role}
                </li>
              ))}
            </ul>

            <p
              className="fade-up fade-up-3"
              style={{
                fontFamily:   'var(--font-mono)',
                fontSize:     '14px',
                lineHeight:   '1.85',
                color:        'var(--text-2)',
                maxWidth:     '540px',
                marginBottom: '40px',
              }}
            >
              Full-Stack and AI Engineer with a deep commitment to developer experience
              and customer success. I build agentic systems, cloud-native APIs, and the
              support tooling that keeps them running — bringing 5+ years of technical
              leadership in customer-facing roles.
            </p>

            {/* CTAs */}
            <div
              className="fade-up fade-up-4"
              style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <Link
                href="/projects"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '12px',
                  fontWeight:    '700',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  padding:       '12px 24px',
                  background:    'var(--cyan)',
                  color:         'var(--obsidian)',
                  borderRadius:  '2px',
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '8px',
                }}
              >
                View Projects ↗
              </Link>
              <Link
                href="/about"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '12px',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  padding:       '12px 24px',
                  border:        '1px solid var(--border)',
                  color:         'var(--text-2)',
                  borderRadius:  '2px',
                  display:       'inline-flex',
                  alignItems:    'center',
                  gap:           '8px',
                }}
              >
                About Me
              </Link>
            </div>

            {/* Social links */}
            <div
              className="fade-up fade-up-5"
              style={{ display: 'flex', gap: '20px', marginTop: '40px' }}
            >
              {[
                { href: 'https://github.com/zmcentire',              label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/zachmcentire/', label: 'LinkedIn' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} profile`}
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color:         'var(--text-3)',
                    borderBottom:  '1px solid var(--border)',
                    paddingBottom: '2px',
                    transition:    'color 0.2s, border-color 0.2s',
                  }}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Headshot */}
          <div
            className="fade-up fade-up-3"
            style={{ position: 'relative', flexShrink: 0 }}
          >
            <div
              aria-hidden="true"
              style={{
                position:     'absolute',
                inset:        '-3px',
                borderRadius: '4px',
                boxShadow:    '0 0 30px rgba(0,229,255,0.12), 0 0 80px rgba(139,26,26,0.08)',
                zIndex:       0,
              }}
            />
            <Image
              src="/images/Headshot.jpeg"
              alt="Zach McEntire"
              width={260}
              height={320}
              priority
              style={{
                objectFit:     'cover',
                objectPosition:'center top',
                borderRadius:  '2px',
                border:        '1px solid var(--border)',
                filter:        'saturate(0.8) contrast(1.05)',
                position:      'relative',
                zIndex:        1,
                display:       'block',
              }}
            />
            {/* Corner accents */}
            {[
              { top: -6, left: -6 },
              { top: -6, right: -6 },
              { bottom: -6, left: -6 },
              { bottom: -6, right: -6 },
            ].map((pos, i) => (
              <div
                key={i}
                aria-hidden="true"
                style={{
                  position:    'absolute',
                  ...pos,
                  width:       '12px',
                  height:      '12px',
                  borderTop:   i < 2 ? '2px solid var(--cyan)' : undefined,
                  borderBottom:i >= 2 ? '2px solid var(--cyan)' : undefined,
                  borderLeft:  i % 2 === 0 ? '2px solid var(--cyan)' : undefined,
                  borderRight: i % 2 !== 0 ? '2px solid var(--cyan)' : undefined,
                  zIndex:      2,
                }}
              />
            ))}
          </div>
        </section>

        {/* ── Quick stats strip ───────────────────────────────────────────── */}
        <section
          aria-label="Quick stats"
          style={{
            borderTop:    '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            background:   'var(--surface)',
          }}
        >
          <dl
            style={{
              maxWidth:       '1100px',
              margin:         '0 auto',
              padding:        '32px 24px',
              display:        'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap:            '32px',
            }}
          >
            {[
              { value: '5+',  label: 'Years in tech'        },
              { value: '10+', label: 'Projects shipped'     },
              { value: '3',   label: 'Cloud platforms'      },
              { value: 'AI',  label: 'Agent systems built'  },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <dt
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontSize:      '32px',
                    fontWeight:    '700',
                    color:         'var(--cyan)',
                    lineHeight:    1,
                    marginBottom:  '6px',
                  }}
                >
                  {value}
                </dt>
                <dd
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color:         'var(--text-2)',
                  }}
                >
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}
