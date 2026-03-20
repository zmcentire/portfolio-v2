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

const stats = [
  { value: '5+',  label: 'Years in tech'       },
  { value: '10+', label: 'Projects shipped'    },
  { value: '3',   label: 'Cloud platforms'     },
  { value: 'AI',  label: 'Agent systems built' },
]

export default function HomePage() {
  return (
    <>
      {/* Decorative overlays — aria-hidden removes them from the AT tree entirely */}
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette"  aria-hidden="true" />

      {/* Ambient glow blobs — purely decorative, hidden from AT */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="glow-blob glow-blob--crimson" style={{ top: '-20%', left: '-10%', width: '600px', height: '600px' }} />
        <div className="glow-blob glow-blob--cyan"    style={{ bottom: '-10%', right: '-5%', width: '500px', height: '500px' }} />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────────────────
          <section> with aria-labelledby points to the h1 inside it.
          Screen readers announce: "Introduction, landmark" when entering.
          This is preferred over aria-label because it reuses visible text.
      ────────────────────────────────────────────────────────────────────── */}
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
        {/* Text content */}
        <div style={{ flex: '1 1 400px' }}>

          {/* Status indicator — <p> is correct here, not a heading */}
          <p className="type-prompt fade-up fade-up-1" style={{ marginBottom: '16px' }}>
            {/* > character is decorative; screen readers don't need it */}
            <span aria-hidden="true">{'> '}</span>Available for new roles
          </p>

          {/* h1 — one per page, labels the hero section via aria-labelledby */}
          <h1
            id="hero-heading"
            className="type-display fade-up fade-up-2"
            style={{ marginBottom: '8px' }}
          >
            Zach
            {/* <br> is fine inside headings — AT handles it correctly */}
            <br />
            {/* <span> keeps "McEntire" inside the h1 so it reads as one name,
                not two separate headings. The .type-dim class applies the
                muted colour — purely visual, semantics unchanged. */}
            <span className="type-dim">McEntire</span>
          </h1>

          {/* Specialisation tags — <ul> with role="list" is semantically
              correct for a group of peer items. aria-label names the group. */}
          <ul
            role="list"
            aria-label="Specializations"
            className="fade-up fade-up-3"
            style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '20px 0 32px' }}
          >
            {roles.map((role) => (
              <li key={role} className="pill">{role}</li>
            ))}
          </ul>

          {/* Bio — plain <p>, no heading needed */}
          <p
            className="type-body fade-up fade-up-3"
            style={{ maxWidth: '540px', marginBottom: '40px' }}
          >
            Full-Stack and AI Engineer with a deep commitment to developer experience
            and customer success. I build agentic systems, cloud-native APIs, and the
            support tooling that keeps them running — bringing 5+ years of technical
            leadership in customer-facing roles.
          </p>

          {/* CTA buttons — no role needed, <a> and <Link> are already interactive */}
          <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/projects" className="btn btn--primary" style={{ padding: '12px 24px', fontSize: '12px' }}>
              View Projects ↗
            </Link>
            <Link href="/about" className="btn btn--secondary" style={{ padding: '12px 24px', fontSize: '12px' }}>
              About Me
            </Link>
          </div>

          {/* Social links — grouped in a <nav> landmark with a label so
              AT users can navigate to it from the landmarks menu.
              This is a secondary nav, distinct from the main header nav. */}
          <nav
            aria-label="Social profiles"
            className="fade-up fade-up-5"
            style={{ marginTop: '40px' }}
          >
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
                    // Explicit label: "GitHub profile, opens in new tab"
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

        {/* Headshot — <figure> is the correct semantic wrapper for
            self-contained media with a caption relationship.
            figcaption is visually hidden but present for AT. */}
        <figure
          className="fade-up fade-up-3"
          style={{ position: 'relative', flexShrink: 0, margin: 0 }}
        >
          {/* Glow ring — decorative, hidden from AT */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: '-3px', borderRadius: '4px',
              boxShadow: 'var(--glow-cyan)',
              zIndex: 0,
            }}
          />
          <Image
            src="/images/Headshot.jpeg"
            alt="Zach McEntire, Full-Stack and AI Engineer"
            width={260}
            height={320}
            priority
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
          {/* Corner accent brackets — decorative chrome, hidden from AT */}
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
          {/* Visually hidden caption — AT reads image then caption */}
          <figcaption className="sr-only">
            Portrait photograph of Zach McEntire
          </figcaption>
        </figure>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────────
          <section> wrapping a <dl> (description list).
          <dl> is the correct element for key/value pairs: metric + label.
          Each pair is wrapped in a <div> — valid HTML5 inside <dl>.
          aria-labelledby ties the section to its visible heading.
      ────────────────────────────────────────────────────────────────────── */}
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
        {/* Visually hidden heading labels the section for AT landmark nav */}
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
              {/* dt = term (the metric value) */}
              <dt
                className="type-h2"
                style={{ color: 'var(--color-accent-cyan)', lineHeight: 1, marginBottom: '6px' }}
              >
                {value}
              </dt>
              {/* dd = description (what the metric means) */}
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