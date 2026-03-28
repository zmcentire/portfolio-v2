import Link from 'next/link'
import { RESUME_URL, RESUME_LABEL, GITHUB_URL, LINKEDIN_URL, EMAIL } from '@/lib/constants'

// ─── Footer nav structure ─────────────────────────────────────────────────────
// Explicit type so every link has `external` — avoids the union-type error
// TypeScript infers when some objects have the property and others don't.
interface FooterLink { href: string; label: string; external: boolean }
interface FooterGroup { heading: string; links: FooterLink[] }

const NAV_GROUPS: FooterGroup[] = [
  {
    heading: 'Work',
    links: [
      { href: '/projects',          label: 'Projects',       external: false },
      { href: '/projects/tigerdata', label: 'TigerData',      external: false },
      { href: '/projects/hotzone',   label: 'HotZone',        external: false },
      { href: '/projects/poly',      label: 'Poly Platform',  external: false },
    ],
  },
  {
    heading: 'Me',
    links: [
      { href: '/about',   label: 'About',   external: false },
      { href: '/support', label: 'Support', external: false },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { href: `mailto:${EMAIL}`,    label: 'Email',    external: true },
      { href: LINKEDIN_URL,          label: 'LinkedIn', external: true },
      { href: GITHUB_URL,            label: 'GitHub',   external: true },
    ],
  },
]

// ─── Shared link style ────────────────────────────────────────────────────────
const linkStyle: React.CSSProperties = {
  fontFamily:     'var(--font-mono)',
  fontSize:       '11px',
  letterSpacing:  '0.08em',
  color:          'var(--color-text-tertiary)',
  textDecoration: 'none',
  display:        'block',
  padding:        '3px 0',
  transition:     'color 0.18s ease',
}

// ─── Footer component ─────────────────────────────────────────────────────────
// Server Component — no interactivity needed here.
export default function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer
      aria-labelledby="footer-heading"
      style={{
        position:   'relative',
        zIndex:     1,
        borderTop:  '1px solid var(--color-border)',
        background: 'var(--color-bg-surface)',
        marginTop:  'auto',
      }}
    >
      <h2 id="footer-heading" className="sr-only">Site footer</h2>

      {/* ── Main footer grid ─────────────────────────────────────────── */}
      <div style={{
        maxWidth:   '1100px',
        margin:     '0 auto',
        padding:    '56px 24px 40px',
        display:    'grid',
        gridTemplateColumns: '1fr auto',
        gap:        '48px',
        alignItems: 'start',
      }}
      className="footer-grid"
      >

        {/* Left — identity + resume CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <p style={{
              fontFamily:    'var(--font-display)',
              fontSize:      '18px',
              fontWeight:    '600',
              letterSpacing: '0.08em',
              color:         'var(--color-text-primary)',
              marginBottom:  '6px',
            }}>
              Zach McEntire
            </p>
            <p style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '11px',
              letterSpacing: '0.06em',
              color:         'var(--color-text-tertiary)',
            }}>
              Full-Stack &amp; AI Engineer · Salt Lake City / Remote
            </p>
          </div>

          {/* Resume download — the primary footer CTA */}
          <a
            href={RESUME_URL}
            download="zach-mcentire-resume.pdf"
            aria-label={`${RESUME_LABEL} — PDF download`}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              fontFamily:     'var(--font-mono)',
              fontSize:       '11px',
              fontWeight:     '500',
              letterSpacing:  '0.12em',
              textTransform:  'uppercase',
              textDecoration: 'none',
              padding:        '10px 18px',
              background:     'transparent',
              border:         '1px solid var(--color-border)',
              borderLeft:     '3px solid var(--color-accent-crimson)',
              borderRadius:   '2px',
              color:          'var(--color-text-secondary)',
              alignSelf:      'flex-start',
              transition:     'color 0.2s, border-color 0.2s',
            }}
            className="footer-resume-btn"
          >
            <span aria-hidden="true" style={{ fontSize: '13px' }}>↓</span>
            Resume PDF
          </a>

          {/* Contact links */}
          <nav aria-label="Contact links" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { href: `mailto:${EMAIL}`, label: 'Email ↗',    aria: 'Send email' },
              { href: LINKEDIN_URL,       label: 'LinkedIn ↗', aria: 'LinkedIn profile, opens in new tab' },
              { href: GITHUB_URL,         label: 'GitHub ↗',   aria: 'GitHub profile, opens in new tab'   },
            ].map(({ href, label, aria }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                aria-label={aria}
                style={{
                  ...linkStyle,
                  display:       'inline',
                  paddingBottom: '1px',
                  borderBottom:  '1px solid var(--color-border)',
                }}
                className="footer-contact-link"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right — nav groups */}
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
          {NAV_GROUPS.map((group) => (
            <nav key={group.heading} aria-label={`${group.heading} links`}>
              <p style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         'var(--color-accent-brass)',
                marginBottom:  '12px',
                fontWeight:    '500',
              }}>
                {group.heading}
              </p>
              <ul role="list" style={{ listStyle: 'none' }}>
                {group.links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                        style={linkStyle}
                        className="footer-nav-link"
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        style={linkStyle}
                        className="footer-nav-link"
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ── Colophon bar ─────────────────────────────────────────────── */}
      <div style={{
        maxWidth:       '1100px',
        margin:         '0 auto',
        padding:        '16px 24px',
        borderTop:      '1px solid var(--color-border)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '8px',
      }}>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '10px',
          letterSpacing: '0.08em',
          color:         'var(--color-text-tertiary)',
        }}>
          © {year} Zach McEntire
        </p>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '10px',
          letterSpacing: '0.06em',
          color:         'var(--color-text-tertiary)',
        }}>
          Built with Next.js · Deployed on Vercel
        </p>
      </div>

      <style>{`
        .footer-resume-btn:hover {
          color:        var(--color-text-primary) !important;
          border-color: var(--color-border-hover) !important;
          border-left-color: var(--color-accent-crimson-lt) !important;
        }
        .footer-contact-link:hover,
        .footer-nav-link:hover {
          color: var(--color-text-secondary) !important;
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}