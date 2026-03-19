import type { Metadata } from 'next'
import Image from 'next/image'
import { skills } from '@/lib/data'
import BioPersonalizer from '@/components/BioPersonalizer'

export const metadata: Metadata = {
  title: 'About',
  description: 'Full-Stack and AI Engineer with 5+ years of technical leadership.',
}

export default function AboutPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />
      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

        <section aria-label="Introduction" style={{ display: 'flex', gap: '56px', alignItems: 'flex-start', marginBottom: '80px', flexWrap: 'wrap' }}>
          <div className="fade-up fade-up-1" style={{ position: 'relative', flexShrink: 0 }}>
            <Image src="/images/Headshot.jpeg" alt="Zach McEntire" width={220} height={270} priority
              style={{ objectFit: 'cover', objectPosition: 'center top', borderRadius: '2px', border: '1px solid var(--border)', filter: 'saturate(0.75) contrast(1.1)', display: 'block', position: 'relative', zIndex: 1 }}
            />
            <div aria-hidden="true" style={{ position: 'absolute', inset: '-2px', borderRadius: '4px', boxShadow: '0 0 24px rgba(0,229,255,0.12), 0 0 60px rgba(139,26,26,0.08)', zIndex: 0 }} />
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <p className="fade-up fade-up-1 section-eyebrow"><span className="accent">// </span>About</p>
            <h1 className="fade-up fade-up-2 section-title" style={{ marginBottom: '4px' }}>Zach McEntire</h1>
            <p className="fade-up fade-up-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '0.06em', color: 'var(--text-2)', marginBottom: '28px' }}>
              Software & Customer Success Engineer
            </p>
            <div className="ruled-divider fade-up fade-up-3" aria-hidden="true"><span>⬡</span></div>
            <div className="fade-up fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.85', color: 'var(--text-2)' }}>
                Full-Stack and AI Engineer with a deep commitment to developer experience and customer success. I build agentic systems, cloud-native APIs, and the support tooling that keeps them running — bringing 5+ years of technical leadership in customer-facing roles spanning Technical Support and Technical Account Management.
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.85', color: 'var(--text-2)' }}>
                I leverage Python and Bash scripting to craft custom integrations and data ingest routines for complex enterprise environments, and apply strong network and security knowledge across Windows, macOS, and Linux to troubleshoot and resolve deep-system defects. Recently shipped{' '}
                <a href="https://tigerdata-fitness-tracker-production-a693.up.railway.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cyan)', borderBottom: '1px solid rgba(0,229,255,0.3)' }}>TigerData</a>
                {' '}— an agentic AI fitness tracker powered by Claude tool-use agents, TimescaleDB, and FastAPI.
              </p>
            </div>
            <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
              {[{ href: 'https://github.com/zmcentire', label: 'GitHub' }, { href: 'https://www.linkedin.com/in/zachmcentire/', label: 'LinkedIn' }].map(({ href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '8px 14px', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-2)' }}>{label} ↗</a>
              ))}
              <a href="https://drive.google.com/file/d/1o6YLTJYDMKCfSPTZ4n80DPPWaRRJbY2i/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '9px 18px', background: 'var(--cyan)', color: 'var(--obsidian)', borderRadius: '2px' }}>↓ Resume</a>
            </div>
          </div>
        </section>

        <section aria-labelledby="skills-heading">
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '56px' }}>
            <p className="section-eyebrow"><span className="accent">// </span>Skills & Stack</p>
            <h2 id="skills-heading" className="section-title" style={{ marginBottom: '40px' }}>Technical Arsenal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '16px' }} role="list">
              {skills.map((group, i) => (
                <article key={group.category} role="listitem" className={`fade-up fade-up-${Math.min(i + 1, 5)}`} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--crimson)', borderRadius: '2px', padding: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: '14px', fontWeight: '500' }}>{group.category}</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '7px' }} aria-label={`${group.category} skills`}>
                    {group.items.map((skill) => (
                      <li key={skill} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-2)', letterSpacing: '0.02em' }}>{skill}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <BioPersonalizer />
      </div>
    </>
  )
}
