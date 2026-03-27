import type { Metadata } from 'next'
import Image from 'next/image'
import BioPersonalizer from '@/components/BioPersonalizer'
import SkillsSection from '@/components/SkillsSection'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Full-Stack and AI Engineer with 5+ years of technical leadership in customer-facing roles. Specializing in agentic systems, cloud-native APIs, and developer experience.',
}

export default function AboutPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      {/* <main> carries the implicit ARIA role="main" landmark.
          This is already set in layout.tsx — the page-container div
          here is just a layout wrapper inside that main. */}
      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Introduction ────────────────────────────────────────────────
            <section aria-labelledby> ties the section to its visible h1.
            AT users hear "Introduction, region" when they enter.
            Using aria-labelledby is preferred over aria-label because
            it reuses text already visible on screen.
        ──────────────────────────────────────────────────────────────── */}
        <section
          aria-labelledby="about-heading"
          style={{ display: 'flex', gap: '56px', alignItems: 'flex-start', marginBottom: '80px', flexWrap: 'wrap' }}
        >
          {/* <figure> is the correct semantic wrapper for a self-contained
              image with an implied caption. margin:0 resets browser default. */}
          <figure className="fade-up fade-up-1" style={{ position: 'relative', flexShrink: 0, margin: 0 }}>
            <Image
              src="/images/Headshot.jpeg"
              alt="Zach McEntire, Full-Stack and AI Engineer"
              width={220}
              height={270}
              priority
              style={{
                objectFit:      'cover',
                objectPosition: 'center top',
                borderRadius:   '2px',
                border:         '1px solid var(--color-border)',
                filter:         'saturate(0.75) contrast(1.1)',
                display:        'block',
                position:       'relative',
                zIndex:         1,
              }}
            />
            {/* Glow ring — decorative */}
            <div
              aria-hidden="true"
              style={{
                position:     'absolute',
                inset:        '-2px',
                borderRadius: '4px',
                boxShadow:    'var(--glow-cyan)',
                zIndex:       0,
              }}
            />
            <figcaption className="sr-only">Portrait photograph of Zach McEntire</figcaption>
          </figure>

          <div style={{ flex: '1 1 300px' }}>
            {/* Eyebrow — <p> not a heading; it's a label prefix, not a title */}
            <p className="fade-up fade-up-1 type-eyebrow" style={{ marginBottom: '8px' }}>
              <span className="accent" aria-hidden="true">// </span>About
            </p>

            {/* h1 — page title. id matches aria-labelledby on <section> */}
            <h1
              id="about-heading"
              className="fade-up fade-up-2 type-h1"
              style={{ marginBottom: '4px' }}
            >
              Zach McEntire
            </h1>

            {/* Role subtitle — <p> not a heading; subordinate to h1 */}
            <p
              className="fade-up fade-up-2"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '13px',
                letterSpacing: '0.06em',
                color:         'var(--color-text-secondary)',
                marginBottom:  '28px',
              }}
            >
              Software &amp; Customer Success Engineer
            </p>

            {/* Decorative divider — aria-hidden removes purely visual element */}
            <div className="ruled-divider fade-up fade-up-3" aria-hidden="true">
              <span>⬡</span>
            </div>

            {/* Bio — two <p> elements inside a <div> grouping them visually.
                No role needed; AT reads them as sequential paragraphs. */}
            <div className="fade-up fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p className="type-body">
                Full-Stack and AI Engineer with a deep commitment to developer experience
                and customer success. I build agentic systems, cloud-native APIs, and the
                support tooling that keeps them running — bringing 5+ years of technical
                leadership in customer-facing roles spanning Technical Support and
                Technical Account Management.
              </p>
              <p className="type-body">
                I leverage Python and Bash scripting to craft custom integrations and data
                ingest routines for complex enterprise environments, and apply strong
                network and security knowledge across Windows, macOS, and Linux to
                troubleshoot and resolve deep-system defects. Recently shipped{' '}
                <a
                  href="https://tigerdata-fitness-tracker-production-a693.up.railway.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TigerData fitness tracker, opens in new tab"
                  className="link-cyan"
                >
                  TigerData Fitness Tracker
                </a>
                {' '}— an agentic AI fitness tracker powered by Claude tool-use agents,
                TimescaleDB, and FastAPI.
              </p>
            </div>

            {/* Contact links — <nav> landmark so AT users can jump here.
                Label distinguishes from the main header nav. */}
            <nav
              aria-label="Contact and social profiles"
              className="fade-up fade-up-4"
              style={{ marginTop: '32px' }}
            >
              <ul
                role="list"
                style={{ listStyle: 'none', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
              >
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
                      className="btn btn--secondary"
                      style={{ padding: '8px 14px', fontSize: '11px' }}
                    >
                      {label} ↗
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Download resume, opens in new tab"
                    className="btn btn--primary"
                    style={{ padding: '9px 18px', fontSize: '11px' }}
                  >
                    ↓ Resume
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </section>

          {/* ── Skills ────────────────────────────────────────────────────────
            SkillsSection is a 'use client' component — tabbed layout
            with proficiency indicators and staggered entrance animation.
        ──────────────────────────────────────────────────────────────── */}
        <SkillsSection />

        {/* ── AI Personalizer ───────────────────────────────────────────────
            BioPersonalizer contains its own <section aria-labelledby>
            and form with proper labelling — see that component.
        ──────────────────────────────────────────────────────────────── */}
        <BioPersonalizer />

      </div>
    </>
  )
}