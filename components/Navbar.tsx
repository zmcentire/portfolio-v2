'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/',         label: 'Home'     },
  { href: '/about',    label: 'About'    },
  { href: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const pathname  = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>

      <header
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          200,
          borderBottom:    scrolled ? '1px solid var(--border)' : '1px solid transparent',
          background:      scrolled
            ? 'rgba(13,13,15,0.94)'
            : 'rgba(13,13,15,0.6)',
          backdropFilter:  'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition:      'background 0.3s, border-color 0.3s',
        }}
      >
        <nav
          aria-label="Main navigation"
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
            aria-label="Zach McEntire — home"
            style={{
              fontFamily:    'var(--font-display)',
              fontSize:      '15px',
              fontWeight:    '600',
              letterSpacing: '0.12em',
              color:         'var(--text-1)',
              textTransform: 'uppercase',
            }}
          >
            Zach McEntire
          </Link>

          {/* Desktop links */}
          <ul
            role="list"
            style={{
              display:    'flex',
              gap:        '32px',
              listStyle:  'none',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         pathname === href ? 'var(--cyan)' : 'var(--text-2)',
                    borderBottom:  pathname === href ? '1px solid var(--cyan)' : '1px solid transparent',
                    paddingBottom: '2px',
                    transition:    'color 0.2s, border-color 0.2s',
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '11px',
                  fontWeight:    '700',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  color:         'var(--obsidian)',
                  background:    'var(--cyan)',
                  padding:       '7px 14px',
                  borderRadius:  '2px',
                }}
              >
                Resume ↓
              </a>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              display:    'none',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '8px',
              color:      'var(--text-1)',
            }}
            className="hamburger"
          >
            <span aria-hidden="true" style={{ fontSize: '20px', fontFamily: 'var(--font-mono)' }}>
              {menuOpen ? '✕' : '≡'}
            </span>
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            role="dialog"
            aria-label="Navigation menu"
            style={{
              background:  'rgba(13,13,15,0.98)',
              borderTop:   '1px solid var(--border)',
              padding:     '24px',
            }}
          >
            <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '13px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color:         pathname === href ? 'var(--cyan)' : 'var(--text-2)',
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '13px',
                    letterSpacing: '0.10em',
                    textTransform: 'uppercase',
                    color:         'var(--cyan)',
                  }}
                >
                  Resume ↓
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Spacer so content isn't hidden under fixed navbar */}
      <div style={{ height: '56px' }} aria-hidden="true" />

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </>
  )
}
