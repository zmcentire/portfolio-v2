'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ─── useScrollPosition hook ───────────────────────────────────────────────────
// Returns scroll Y as a number, throttled to animation frames.
// Passive listener — never blocks the scroll thread.
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let rafId: number
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    setScrollY(window.scrollY)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return scrollY
}

// ─── useScrollProgress hook ───────────────────────────────────────────────────
// Returns 0–1 representing how far through the page the user has scrolled.
function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId: number
    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const el  = document.documentElement
        const max = el.scrollHeight - el.clientHeight
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return progress
}

// ─── Constants ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/projects', label: 'Projects' },
]

const RESUME_URL =
  'https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing'

// ─── Animated hamburger SVG ───────────────────────────────────────────────────
// Three lines morph into an X via CSS transform — no Unicode glyphs.
function HamburgerIcon({ open }: { open: boolean }) {
  const base: React.CSSProperties = {
    display:         'block',
    width:           '20px',
    height:          '1.5px',
    background:      'currentColor',
    borderRadius:    '1px',
    transformOrigin: 'center',
    transition:      'transform 0.28s ease, opacity 0.2s ease',
  }
  return (
    <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      <span style={{ ...base, transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
      <span style={{ ...base, opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }} />
      <span style={{ ...base, transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
    </span>
  )
}

// ─── Desktop nav item with active dot indicator ───────────────────────────────
function NavItem({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className="desktop-nav-link"
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            '5px',
          fontFamily:     'var(--font-mono)',
          fontSize:       '10px',
          letterSpacing:  '0.16em',
          textTransform:  'uppercase',
          color:          active ? 'var(--color-accent-cyan)' : 'var(--color-text-secondary)',
          textDecoration: 'none',
          padding:        '2px 0',
          transition:     'color 0.2s ease',
        }}
      >
        {label}
        {/* Cyan dot — appears under the active link */}
        <span
          aria-hidden="true"
          style={{
            display:      'block',
            width:        active ? '4px' : '0px',
            height:       '4px',
            borderRadius: '50%',
            background:   'var(--color-accent-cyan)',
            boxShadow:    active ? '0 0 6px rgba(0,229,255,0.8)' : 'none',
            overflow:     'hidden',
            transition:   'width 0.25s ease, box-shadow 0.25s ease',
          }}
        />
      </Link>
    </li>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname  = usePathname()
  const scrollY   = useScrollPosition()
  const progress  = useScrollProgress()
  const [menuOpen, setMenuOpen] = useState(false)
  const mobileNavRef = useRef<HTMLElement>(null)

  const scrolled      = scrollY > 20
  const deepScrolled  = scrollY > 80

  // Close on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* ── Fixed header ────────────────────────────────────────────────── */}
      <header style={{
        position:             'fixed',
        top: 0, left: 0, right: 0,
        zIndex:               200,
        background:           scrolled
          ? `rgba(13,13,15,${deepScrolled ? '0.97' : '0.92'})`
          : 'rgba(13,13,15,0.35)',
        backdropFilter:       'blur(12px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
        borderBottom:         `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
        transition:           'background 0.4s ease, border-color 0.35s ease',
        willChange:           'transform',
      }}>

        {/* Scroll progress bar — crimson → cyan gradient, 1.5px tall */}
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            top:        0,
            left:       0,
            height:     '1.5px',
            width:      `${progress * 100}%`,
            background: 'linear-gradient(90deg, var(--color-accent-crimson) 0%, var(--color-accent-cyan) 100%)',
            opacity:    scrollY > 5 ? 1 : 0,
            transition: 'width 0.06s linear, opacity 0.4s ease',
          }}
        />

        <nav
          aria-label="Main"
          style={{
            maxWidth:       '1100px',
            margin:         '0 auto',
            padding:        '0 24px',
            height:         '56px',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            aria-label="Zach McEntire — homepage"
            className="nav-brand"
            style={{
              fontFamily:     'var(--font-display)',
              fontSize:       '14px',
              letterSpacing:  '0.12em',
              color:          'var(--color-text-primary)',
              textDecoration: 'none',
              transition:     'color 0.2s ease, text-shadow 0.2s ease',
            }}
          >
            Zach McEntire
          </Link>

          {/* Desktop nav */}
          <ul
            role="list"
            className="desktop-nav"
            style={{
              display:    'flex',
              gap:        '36px',
              listStyle:  'none',
              alignItems: 'center',
              margin:     0,
              padding:    0,
            }}
          >
            {NAV_LINKS.map(({ href, label }) => (
              <NavItem key={href} href={href} label={label} active={pathname === href} />
            ))}
            <li>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume, opens in new tab"
                className="btn btn--primary"
                style={{ padding: '7px 16px', fontSize: '10px', letterSpacing: '0.12em' }}
              >
                Resume ↓
              </a>
            </li>
          </ul>

          {/* Hamburger — shown only on mobile via CSS */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(v => !v)}
            className="hamburger"
            style={{
              display:        'none',
              background:     'none',
              border:         '1px solid var(--color-border)',
              borderRadius:   '2px',
              cursor:         'pointer',
              padding:        '9px 10px',
              color:          'var(--color-text-primary)',
              alignItems:     'center',
              justifyContent: 'center',
              transition:     'border-color 0.2s ease',
            }}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile menu ───────────────────────────────────────────────────── */}
      {/* Outer div catches backdrop clicks */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        190,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false) }}
      >
        {/* Dimmed backdrop */}
        <div style={{
          position:             'absolute',
          inset:                0,
          background:           'rgba(0,0,0,0.65)',
          backdropFilter:       'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity:              menuOpen ? 1 : 0,
          transition:           'opacity 0.3s ease',
        }} />

        {/* Slide-in panel — easeOutExpo for the snappy feel */}
        <nav
          id="mobile-nav"
          ref={mobileNavRef}
          aria-label="Mobile"
          style={{
            position:      'absolute',
            top:           0,
            right:         0,
            bottom:        0,
            width:         'min(300px, 82vw)',
            background:    'var(--color-bg-surface)',
            borderLeft:    '1px solid var(--color-border)',
            padding:       '72px 28px 36px',
            display:       'flex',
            flexDirection: 'column',
            gap:           '0',
            transform:     menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition:    'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowY:     'auto',
          }}
        >
          {/* Panel label */}
          <p aria-hidden="true" style={{
            position:      'absolute',
            top:           '20px',
            left:          '28px',
            fontFamily:    'var(--font-mono)',
            fontSize:      '9px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--color-text-tertiary)',
            margin:        0,
          }}>
            {'// '} Navigation
          </p>

          {/* Links — display font, large size for touch targets */}
          <ul
            role="list"
            style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      display:        'flex',
                      alignItems:     'center',
                      gap:            '14px',
                      fontFamily:     'var(--font-display)',
                      fontSize:       '20px',
                      letterSpacing:  '0.06em',
                      color:          active
                        ? 'var(--color-accent-cyan)'
                        : 'var(--color-text-primary)',
                      textDecoration: 'none',
                      padding:        '16px 0',
                      borderBottom:   '1px solid var(--color-border)',
                      transition:     'color 0.2s ease',
                    }}
                  >
                    {/* Active indicator dot */}
                    <span aria-hidden="true" style={{
                      width:        active ? '5px' : '0',
                      height:       '5px',
                      borderRadius: '50%',
                      background:   'var(--color-accent-cyan)',
                      boxShadow:    active ? '0 0 8px rgba(0,229,255,0.9)' : 'none',
                      flexShrink:   0,
                      overflow:     'hidden',
                      transition:   'width 0.2s ease',
                    }} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Bottom: resume + socials */}
          <div style={{ marginTop: 'auto', paddingTop: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download resume, opens in new tab"
              className="btn btn--primary"
              style={{ textAlign: 'center', padding: '13px', fontSize: '11px', letterSpacing: '0.10em' }}
            >
              ↓ Download Resume
            </a>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              {[
                { href: 'https://github.com/zmcentire',              label: 'GitHub'   },
                { href: 'https://www.linkedin.com/in/zachmcentire/', label: 'LinkedIn' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} profile, opens in new tab`}
                  style={{
                    fontFamily:     'var(--font-mono)',
                    fontSize:       '10px',
                    letterSpacing:  '0.12em',
                    textTransform:  'uppercase',
                    color:          'var(--color-text-tertiary)',
                    textDecoration: 'none',
                    transition:     'color 0.2s ease',
                  }}
                >
                  {label} ↗
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {/* Layout spacer matching fixed header height */}
      <div style={{ height: '56px' }} aria-hidden="true" />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }

        /* Brand — subtle cyan glow on hover */
        .nav-brand:hover {
          text-shadow: 0 0 24px rgba(0, 229, 255, 0.28) !important;
        }

        /* Desktop nav link hover */
        .desktop-nav-link:hover {
          color: var(--color-text-primary) !important;
        }

        /* Hamburger hover */
        .hamburger:hover {
          border-color: var(--color-border-hover) !important;
        }

        /* Mobile nav link hover */
        #mobile-nav a:not(.btn):hover {
          color: var(--color-accent-cyan) !important;
        }
      `}</style>
    </>
  )
}