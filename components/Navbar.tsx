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
      {/* Skip link — must be the very first focusable element on the page.
          Allows keyboard/AT users to bypass repeated nav and jump straight
          to the page's main content region. */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* <header> at the top level carries the implicit ARIA role="banner".
          Screen readers expose this as the "Banner" landmark. Only one
          <header role="banner"> should exist per page — child <header>
          elements inside <article>/<section> do not carry this role. */}
      <header
        style={{
          position:             'fixed',
          top: 0, left: 0, right: 0,
          zIndex:               200,
          borderBottom:         scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          background:           scrolled ? 'rgba(13,13,15,0.94)' : 'rgba(13,13,15,0.6)',
          backdropFilter:       'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition:           'background 0.3s, border-color 0.3s',
        }}
      >
        {/* aria-label="Main" distinguishes this <nav> from any secondary
            navigation landmarks on the page (e.g. footer nav, breadcrumb).
            VoiceOver reads: "Main, navigation". */}
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
          {/* Brand link — explicit aria-label clarifies destination for
              screen readers who hear "Zach McEntire" without visual context */}
          <Link
            href="/"
            aria-label="Zach McEntire — homepage"
            className="type-h3"
            style={{ fontSize: '15px', letterSpacing: '0.10em' }}
          >
            Zach McEntire
          </Link>

          {/* role="list" re-establishes list semantics that CSS
              list-style:none strips in Safari + VoiceOver */}
          <ul
            role="list"
            className="desktop-nav"
            style={{ display: 'flex', gap: '32px', listStyle: 'none', alignItems: 'center' }}
          >
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                {/* aria-current="page" is the programmatic equivalent of the
                    active underline — AT users navigating by links hear
                    "current page" announced next to the active item */}
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={`nav-link${pathname === href ? ' nav-link--active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              {/* aria-label explicitly names the action and warns of new tab */}
              <a
                href="https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download resume, opens in new tab"
                className="btn btn--primary"
                style={{ padding: '7px 14px', fontSize: '11px' }}
              >
                Resume ↓
              </a>
            </li>
          </ul>

          {/* Hamburger button.
              - type="button" prevents accidental form submission
              - aria-expanded communicates toggle state to AT
              - aria-controls points to the id of the controlled element
              - aria-label changes dynamically so the announced action is correct */}
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(v => !v)}
            className="hamburger"
            style={{
              display:    'none',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '8px',
              color:      'var(--color-text-primary)',
            }}
          >
            {/* The glyph is purely decorative — state is in aria-label */}
            <span aria-hidden="true" style={{ fontSize: '20px', fontFamily: 'var(--font-mono)' }}>
              {menuOpen ? '✕' : '≡'}
            </span>
          </button>
        </nav>

        {/* Mobile menu rendered as a second <nav> landmark so AT users
            can jump to it independently via landmarks menu.
            id="mobile-nav" matches aria-controls on the hamburger button. */}
        {menuOpen && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            style={{
              background: 'rgba(13,13,15,0.98)',
              borderTop:  '1px solid var(--color-border)',
              padding:    '24px',
            }}
          >
            <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={pathname === href ? 'page' : undefined}
                    className={`nav-link${pathname === href ? ' nav-link--active' : ''}`}
                    style={{ fontSize: '13px' }}
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
                  aria-label="Download resume, opens in new tab"
                  className="nav-link"
                  style={{ fontSize: '13px', color: 'var(--color-accent-cyan)' }}
                >
                  Resume ↓
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Pure layout spacer — aria-hidden prevents it appearing in AT tree */}
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