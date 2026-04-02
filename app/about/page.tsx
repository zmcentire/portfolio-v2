import type { Metadata } from 'next'
import Image from 'next/image'
import { RESUME_URL } from '@/lib/constants'
import BioPersonalizer from '@/components/BioPersonalizer'
import SkillsSection   from '@/components/SkillsSection'
import ShipSection     from '@/components/ShipSection'

export const metadata: Metadata = {
  title:       'About',
  description: 'Full-Stack & AI Engineer with 5+ years across product engineering, TAM, and agentic AI systems. Based in Salt Lake City, open to remote.',
  alternates:  { canonical: 'https://zachmcentire.dev/about' },
  openGraph: {
    title:       'About Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack & AI Engineer with 5+ years across product engineering, TAM, and agentic AI systems. Salt Lake City / Remote.',
    url:         'https://zachmcentire.dev/about',
  },
  twitter: {
    title:       'About Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack & AI Engineer with 5+ years across product engineering, TAM, and agentic AI systems.',
  },
}

export default function AboutPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

        <section
          aria-labelledby="about-heading"
          style={{ display: 'flex', gap: '56px', alignItems: 'flex-start', marginBottom: '80px', flexWrap: 'wrap' }}
        >
          <figure className="fade-up fade-up-1" style={{ position: 'relative', flexShrink: 0, margin: 0 }}>
            <Image
              src="/images/Headshot.jpeg"
              alt="Zach McEntire, Full-Stack and AI Engineer"
              width={220}
              height={270}
              priority
              quality={90}
              sizes="220px"
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
            <p className="fade-up fade-up-1 type-eyebrow" style={{ marginBottom: '8px' }}>
              <span className="accent" aria-hidden="true">// </span>About
            </p>

            <h1
              id="about-heading"
              className="fade-up fade-up-2 type-h1"
              style={{ marginBottom: '4px' }}
            >
              Zach McEntire
            </h1>

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
              Full-Stack &amp; AI Engineer
            </p>

            <div className="ruled-divider fade-up fade-up-3" aria-hidden="true">
              <span>⬡</span>
            </div>

            <div className="fade-up fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p className="type-body">
                I build agentic systems, cloud-native APIs, and the support tooling that keeps them
                running — then I support the engineers who depend on them. My background spans
                full-stack product engineering, Technical Account Management, and incident command,
                which means I can ship the feature, debug the integration, and explain both
                to a customer on the same day. Sometimes all three in the same afternoon.
              </p>
              <p className="type-body">
                Most recently I deployed and triaged live network infrastructure for the{' '}
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>Sundance Film Festival</span>
                {' '}— seven venues, 20,000+ attendees, zero tolerance for downtime during screenings.
                Before that, I led incident command at{' '}
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>ActionIQ</span>
                {' '}on production CDP failures, built agentic AI tooling at the intersection of{' '}
                <a href="https://github.com/zmcentire/sentinel-ops" target="_blank" rel="noopener noreferrer" className="link-cyan" aria-label="SENTINEL/OPS on GitHub">
                  SENTINEL/OPS
                </a>
                {' '}and{' '}
                <a href="https://support-desk-teal.vercel.app" target="_blank" rel="noopener noreferrer" className="link-cyan" aria-label="SupportDesk live demo">
                  SupportDesk
                </a>
                {', '}and designed 6 custom ASP.NET web pages for Splunk's partner portal as a TAM at Impartner.
              </p>
              <p className="type-body">
                Off the clock: I build electric guitars by hand — most recently a Firebird-inspired
                body carved from scratch with a custom pine hardshell case. I take weightlifting and
                pizza with equal seriousness. Elder emo — industrial, metal, post-rock — it was never
                a phase. Cosmic horror enthusiast. Top three games: Bloodborne, Ocarina of Time, The
                Last of Us. Top three films: Blade Runner, Inception, Shawshank. Currently targeting
                Support Engineering, Full-Stack/Backend, and Solutions Engineering roles — remote
                preferred, Salt Lake City based.</p>
            </div>

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
                    href={RESUME_URL}
                    download="zach-mcentire-resume.pdf"
                    aria-label="Download resume PDF"
                    className="btn btn--primary"
                    style={{ padding: '9px 18px', fontSize: '11px' }}
                  >
                    ↓ Resume PDF
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </section>

        <SkillsSection />
        <ShipSection />
        <BioPersonalizer />

      </div>
    </>
  )
}