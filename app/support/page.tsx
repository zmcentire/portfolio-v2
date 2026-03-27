import type { Metadata } from 'next'
import Link from 'next/link'
import TriageFlowchart from '@/components/TriageFlowchart'

export const metadata: Metadata = {
  title: 'Support Engineering',
  description:
    'Support engineering methodology — issue triage, debugging workflows, escalation frameworks, and technical documentation. 5+ years of Technical Support and Technical Account Management.',
}

// ─── Section heading helper ───────────────────────────────────────────────────
function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-eyebrow" style={{ marginBottom: '8px' }}>
      <span className="accent" aria-hidden="true">// </span>{children}
    </p>
  )
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      style={{
        fontFamily:    'var(--font-display)',
        fontSize:      'clamp(26px, 3.5vw, 38px)',
        fontWeight:    '700',
        letterSpacing: '0.04em',
        color:         'var(--color-text-primary)',
        marginBottom:  '40px',
      }}
    >
      {children}
    </h2>
  )
}

// ─── War story case study ─────────────────────────────────────────────────────
const WAR_STORY = {
  title:    'Firebase Offline Persistence — Silent Data Loss',
  context:  'HotZone field app · Production · Severity: High',
  outcome:  'Identified a Firestore cache invalidation edge case triggered by rapid county filter switching in offline mode. Resolved with a targeted cache eviction strategy — zero data loss in production after fix.',
  sections: [
    {
      label: 'Symptom',
      text:  'Paramedics in the field reported seeing stale drug protocol data after switching between counties without network connectivity. The app showed no errors — it appeared to be serving correct data. The bug was invisible to the user until they acted on wrong information.',
    },
    {
      label: 'Triage approach',
      text:  'Reproduced the issue in a controlled offline environment by simulating flaky connectivity (Chrome DevTools network throttling + airplane mode toggling). Confirmed it was isolated to rapid filter switches during the offline→online transition window, not general offline reads.',
    },
    {
      label: 'Root cause',
      text:  "Firestore's offline persistence cache was serving a stale collection snapshot from the previous county filter when the document listener re-attached on reconnection. The cache hadn't been invalidated between filter switches because the query predicate changed but the collection path did not — Firestore treated it as the same listener.",
    },
    {
      label: 'Resolution',
      text:  'Added explicit cache eviction on county filter change by calling `enableIndexedDbPersistence` with a fresh instance and detaching all active listeners before re-attaching with the new predicate. Added an integration test simulating the offline→county switch→online sequence. Zero recurrences in production after deploy.',
    },
    {
      label: 'Documentation produced',
      text:  'Wrote a runbook covering Firestore offline persistence edge cases for the team, including the listener lifecycle during connectivity transitions and the correct pattern for predicate-changing queries in offline-capable apps.',
    },
  ],
}

// ─── Documentation sample cards ──────────────────────────────────────────────
const DOC_SAMPLES = [
  {
    type:     'Runbook',
    title:    'Firestore Offline Persistence — Listener Lifecycle',
    audience: 'Engineering team',
    sections: ['Symptom patterns', 'Offline→online transition behavior', 'Cache invalidation triggers', 'Correct listener detach/reattach pattern', 'Integration test checklist'],
    accent:   'var(--color-accent-cyan)',
  },
  {
    type:     'Escalation Guide',
    title:    'P1 Issue Response — Field App Data Integrity',
    audience: 'Support & on-call engineers',
    sections: ['Severity classification matrix', 'First-response script', 'Escalation decision tree', 'Stakeholder communication templates', 'Post-mortem trigger conditions'],
    accent:   'var(--color-accent-crimson-lt)',
  },
  {
    type:     'Integration Guide',
    title:    'Claude API Tool-Use — Structured Data Ingestion',
    audience: 'Developers integrating Claude agents',
    sections: ['Tool schema design principles', 'Stateless agent architecture', 'Error handling & retry patterns', 'Type-safe tool call validation', 'Cost optimisation checklist'],
    accent:   'var(--color-accent-brass)',
  },
]

// ─── Methodology cards ────────────────────────────────────────────────────────
const METHODOLOGIES = [
  {
    icon:  '①',
    title: 'Symptom Collection',
    body:  'Never start with solutions. Collect exact error messages, reproduction steps, environment details, and a timeline of when behaviour changed. Half the time the root cause is in the context, not the symptom.',
  },
  {
    icon:  '②',
    title: 'Controlled Reproduction',
    body:  'Reproduce in isolation before touching production. Build the minimum environment that shows the issue — this eliminates environmental variables and prevents compounding the problem during investigation.',
  },
  {
    icon:  '③',
    title: 'Layer Isolation',
    body:  'Work from the outside in. Confirm the request reaches the server before checking server logic. Confirm data reaches the DB before checking queries. Each confirmed layer narrows the search space by half.',
  },
  {
    icon:  '④',
    title: 'Escalation Clarity',
    body:  'Escalate with a complete packet: reproduction steps, layers already eliminated, current hypothesis, and specific ask. Never escalate a vague problem. A well-formed escalation gets resolved 3× faster.',
  },
  {
    icon:  '⑤',
    title: 'Root Cause Documentation',
    body:  'The resolution is not the end of the work. Every non-trivial issue gets a root cause write-up. The goal is to ensure no engineer has to rediscover the same path through the same problem.',
  },
  {
    icon:  '⑥',
    title: 'Customer Communication',
    body:  'Customers want honesty and progress updates, not polished non-answers. Communicate what you know, what you do not know, and what the next step is. Silence is the fastest path to escalation.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SupportPage() {
  return (
    <>
      <div className="scanlines" aria-hidden="true" />

      <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <header style={{ marginBottom: '72px' }}>
          <SectionEyebrow>Support Engineering</SectionEyebrow>
          <h1 style={{
            fontFamily:    'var(--font-display)',
            fontSize:      'clamp(32px, 5vw, 52px)',
            fontWeight:    '700',
            letterSpacing: '0.03em',
            color:         'var(--color-text-primary)',
            marginBottom:  '20px',
          }}>
            Methodology &amp; Practice
          </h1>
          <p className="type-body" style={{ maxWidth: '620px', fontSize: '15px' }}>
            5+ years of Technical Support and Technical Account Management across enterprise
            infrastructure, cloud platforms, and developer tooling. This page documents
            how I approach problems — the process, not just the outcomes.
          </p>

          {/* Credential strip */}
          <div style={{
            display:   'flex',
            gap:       '24px',
            marginTop: '32px',
            flexWrap:  'wrap',
          }}>
            {[
              { label: 'Role types',    value: 'TSE · TAM · DevEx' },
              { label: 'Experience',    value: '5+ years'          },
              { label: 'Environments', value: 'Windows · macOS · Linux' },
              { label: 'Domain',       value: 'Cloud · Network · Storage' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '9px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         'var(--color-text-tertiary)',
                  marginBottom:  '3px',
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '12px',
                  color:         'var(--color-text-primary)',
                  letterSpacing: '0.04em',
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Section 1: Triage flowchart ───────────────────────────────────── */}
        <section aria-labelledby="triage-heading" style={{ marginBottom: '96px' }}>
          <SectionEyebrow>Process</SectionEyebrow>
          <SectionTitle id="triage-heading">Issue Triage Framework</SectionTitle>

          <p className="type-body" style={{ maxWidth: '640px', marginBottom: '36px', fontSize: '14px' }}>
            Every issue enters the same decision tree regardless of severity. The process
            exists to prevent cognitive shortcuts — the temptation to jump to a known solution
            before confirming the actual problem. Following it consistently is what makes
            resolution times predictable.
          </p>

          {/* Flowchart SVG */}
          <div style={{
            border:       '1px solid var(--color-border)',
            borderRadius: '2px',
            overflow:     'hidden',
            marginBottom: '48px',
          }}>
            <TriageFlowchart />
          </div>

          {/* Methodology cards grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap:                 '16px',
          }}>
            {METHODOLOGIES.map((m) => (
              <article
                key={m.title}
                style={{
                  background:   'var(--color-bg-surface)',
                  border:       '1px solid var(--color-border)',
                  borderLeft:   '3px solid var(--color-accent-crimson)',
                  borderRadius: '2px',
                  padding:      '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '16px',
                    color:      'var(--color-accent-brass)',
                    lineHeight: 1,
                  }}>
                    {m.icon}
                  </span>
                  <h3 style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '11px',
                    fontWeight:    '500',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:         'var(--color-text-primary)',
                  }}>
                    {m.title}
                  </h3>
                </div>
                <p className="type-body" style={{ fontSize: '12px', lineHeight: '1.75' }}>
                  {m.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Section 2: War story ──────────────────────────────────────────── */}
        <section aria-labelledby="war-story-heading" style={{ marginBottom: '96px' }}>
          <SectionEyebrow>Case Study</SectionEyebrow>
          <SectionTitle id="war-story-heading">War Story</SectionTitle>

          <article
            aria-labelledby="war-story-title"
            style={{
              background:    'var(--color-bg-surface)',
              border:        '1px solid var(--color-border)',
              borderRadius:  '2px',
              overflow:      'hidden',
            }}
          >
            {/* Card header */}
            <div style={{
              padding:      '20px 24px',
              borderBottom: '1px solid var(--color-border)',
              background:   'var(--color-bg-surface-2)',
              display:      'flex',
              alignItems:   'flex-start',
              justifyContent: 'space-between',
              flexWrap:     'wrap',
              gap:          '12px',
            }}>
              <div>
                <h3
                  id="war-story-title"
                  style={{
                    fontFamily:    'var(--font-display)',
                    fontSize:      '18px',
                    fontWeight:    '600',
                    letterSpacing: '0.04em',
                    color:         'var(--color-text-primary)',
                    marginBottom:  '6px',
                  }}
                >
                  {WAR_STORY.title}
                </h3>
                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '11px',
                  color:         'var(--color-text-tertiary)',
                  letterSpacing: '0.08em',
                }}>
                  {WAR_STORY.context}
                </p>
              </div>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                fontWeight:    '500',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding:       '4px 10px',
                borderRadius:  '2px',
                color:         'var(--color-accent-cyan)',
                background:    'rgba(0,229,255,0.08)',
                border:        '1px solid rgba(0,229,255,0.25)',
                whiteSpace:    'nowrap',
              }}>
                Resolved
              </span>
            </div>

            {/* Outcome callout */}
            <div style={{
              padding:     '16px 24px',
              borderBottom:'1px solid var(--color-border)',
              borderLeft:  '3px solid var(--color-accent-cyan)',
              background:  'rgba(0,229,255,0.03)',
            }}>
              <p style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    '13px',
                lineHeight:  '1.7',
                color:       'var(--color-text-primary)',
              }}>
                {WAR_STORY.outcome}
              </p>
            </div>

            {/* Sections */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {WAR_STORY.sections.map((s) => (
                <div key={s.label}>
                  <p style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'var(--color-accent-brass)',
                    marginBottom:  '8px',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '6px',
                  }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
                    {s.label}
                  </p>
                  <p className="type-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* ── Section 3: Documentation samples ─────────────────────────────── */}
        <section aria-labelledby="docs-heading" style={{ marginBottom: '80px' }}>
          <SectionEyebrow>Documentation</SectionEyebrow>
          <SectionTitle id="docs-heading">What I Write</SectionTitle>

          <p className="type-body" style={{ maxWidth: '600px', marginBottom: '40px', fontSize: '14px' }}>
            Documentation is the multiplier on resolved issues. A well-written runbook
            means the next engineer encounters the same problem for the last time.
            Below are the types of documents I produce and their structure.
          </p>

          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap:                 '20px',
          }}>
            {DOC_SAMPLES.map((doc) => (
              <article
                key={doc.title}
                style={{
                  background:    'var(--color-bg-surface)',
                  border:        '1px solid var(--color-border)',
                  borderTop:     `3px solid ${doc.accent}`,
                  borderRadius:  '2px',
                  padding:       '24px',
                  display:       'flex',
                  flexDirection: 'column',
                  gap:           '16px',
                }}
              >
                {/* Doc type badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         doc.accent,
                    fontWeight:    '500',
                  }}>
                    {doc.type}
                  </span>
                  <span style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '9px',
                    letterSpacing: '0.10em',
                    color:         'var(--color-text-tertiary)',
                  }}>
                    For: {doc.audience}
                  </span>
                </div>

                <h3 style={{
                  fontFamily:    'var(--font-display)',
                  fontSize:      '15px',
                  fontWeight:    '600',
                  letterSpacing: '0.03em',
                  color:         'var(--color-text-primary)',
                  lineHeight:    1.3,
                }}>
                  {doc.title}
                </h3>

                {/* Section list — shows the doc structure */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {doc.sections.map((s, i) => (
                    <li key={s} style={{
                      display:    'flex',
                      alignItems: 'baseline',
                      gap:        '10px',
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '11px',
                      color:      'var(--color-text-secondary)',
                      lineHeight: '1.5',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize:   '9px',
                        color:      'var(--color-text-tertiary)',
                        flexShrink: 0,
                        minWidth:   '16px',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>

                <div style={{
                  marginTop:  'auto',
                  paddingTop: '12px',
                  borderTop:  '1px solid var(--color-border)',
                }}>
                  <p style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color:         'var(--color-text-tertiary)',
                  }}>
                    Available on request
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA strip ─────────────────────────────────────────────────────── */}
        <div style={{
          borderTop:     '1px solid var(--color-border)',
          paddingTop:    '48px',
          display:       'flex',
          alignItems:    'center',
          justifyContent:'space-between',
          flexWrap:      'wrap',
          gap:           '20px',
        }}>
          <div>
            <p style={{
              fontFamily:    'var(--font-display)',
              fontSize:      'clamp(18px, 2.5vw, 24px)',
              color:         'var(--color-text-primary)',
              marginBottom:  '6px',
            }}>
              Interested in working together?
            </p>
            <p className="type-body" style={{ fontSize: '13px' }}>
              View my full engineering work or reach out directly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/projects"
              className="btn btn--secondary"
              style={{ fontSize: '11px', padding: '11px 20px' }}
            >
              View Projects
            </Link>
            <a
              href="https://www.linkedin.com/in/zachmcentire/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile, opens in new tab"
              className="btn btn--primary"
              style={{ fontSize: '11px', padding: '11px 20px' }}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

      </div>
    </>
  )
}