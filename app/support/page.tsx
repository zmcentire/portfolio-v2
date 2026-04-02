import type { Metadata } from 'next'
import Link from 'next/link'
import TriageFlowchart from '@/components/TriageFlowchart'

export const metadata: Metadata = {
  title:       'Support Engineering',
  description: 'Support engineering methodology and practice — issue triage decision trees, debugging war stories, escalation frameworks, and technical documentation. 5+ years of TSE and TAM experience.',
  alternates:  { canonical: 'https://zachmcentire.dev/support' },
  openGraph: {
    title:       'Support Engineering — Zach McEntire',
    description: 'Issue triage frameworks, debugging methodology, escalation guides, and technical documentation from 5+ years of TSE and TAM experience.',
    url:         'https://zachmcentire.dev/support',
  },
}

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

// ─── War stories ──────────────────────────────────────────────────────────────
const WAR_STORIES = [
  {
    title:   'ActionIQ — CDP Data Export Failures (Transient or Systemic?)',
    context: 'Customer Support Engineer · ActionIQ (CDP) · Severity: High · Production',
    outcome: 'Identified memory-induced ingest timeouts as the root cause of transient-looking export failures. Worked with Engineering to scale worker allocation. Resolved the failures permanently without disrupting the customer.',
    sections: [
      {
        label: 'Symptom',
        text:  'A premium support customer was experiencing a higher volume of data export failures than expected. The initial error indicated an expected output file was blank. Critically, these jobs succeeded on retry, which initially pointed to a transient infrastructure issue rather than a systemic defect.',
      },
      {
        label: 'Triage approach',
        text:  'Retries masking failures is a classic signal that something upstream is flaky under load, not randomly failing. I pulled the job timeline in Datadog for the failing export runs and traced backward through the downstream dependency chain, specifically looking at what the export job depended on before it could run.',
      },
      {
        label: 'Root cause',
        text:  'The daily ingest tasks that fed the export pipeline were timing out due to memory pressure. The exports themselves were not the problem, they were waiting on data that was never fully materialized. Once the ingest completed on retry, the export succeeded. The memory issue was invisible at the export layer.',
      },
      {
        label: 'Resolution',
        text:  'Escalated to Engineering with a clear packet: exact job IDs, Datadog trace screenshots, the ingest timeout timestamps aligned to the export failure timestamps, and a specific ask: increase the worker allocation for this customer\'s ingest jobs. Engineering increased allotted workers. Ingest tasks completed within their time window. Export failures stopped.',
      },
      {
        label: 'Customer communication',
        text:  'Maintained proactive communication with the customer throughout, explained what we knew (export jobs were failing), what we were investigating (upstream dependencies), and the timeline. Avoided vague reassurances. Sent a summary with root cause and resolution after Engineering deployed the fix.',
      },
    ],
  },
  {
    title:   'Impartner TAM — Splunk Partner Portal Rebrand (6 Custom ASPX Pages)',
    context: 'Technical Account Manager · Impartner · Splunk Partner Portal · Duration: 3 months',
    outcome: 'Delivered 6 new ASP.NET/ASPX web pages and a new badge navigation system enabling Splunk\'s partner recognition program across product lines on schedule, tested against acceptance criteria I wrote from stakeholder requirements.',
    sections: [
      {
        label: 'The project',
        text:  'Splunk was rebranding their partner portal and launching a new sales badge program with recognition for partners who achieved product certification across different Splunk product lines. They needed 6 new web pages, a new navigation system for the badges, and updated components on existing sales partner profiles and lead/opportunity dashboards.',
      },
      {
        label: 'Stakeholder coordination',
        text:  'The portal rebrand touched RevOps, Marketing, UI/UX, and the Salesforce Admin team, all with different priorities and different definitions of done. I led requirements gathering across all four teams, translated business requirements into technical acceptance criteria, and served as the single point of contact for questions about portal behavior.',
      },
      {
        label: 'Technical implementation',
        text:  'The pages were built in ASP.NET using ASPX, C#, HTML, CSS, and JavaScript. The backend pulled Salesforce data via optimized SQL queries against the Salesforce-backed data source, partner profile fields, opportunity data, and badge eligibility. Getting query performance right was non-trivial: I applied execution plan analysis and window function tuning to keep page load times acceptable for the partner-facing pages.',
      },
      {
        label: 'Testing and delivery',
        text:  'I wrote the test cases myself based on the requirements I had gathered, executed them, iterated through review cycles with the UI/UX and Marketing teams, and managed the deployment through Perforce. The badge navigation system launched on schedule and enabled partner recognition across Splunk\'s product line portfolio.',
      },
    ],
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
    body:  'Reproduce in isolation before touching production. Build the minimum environment that shows the issue, this eliminates environmental variables and prevents compounding the problem during investigation.',
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
    body:  'Customers want honesty and progress updates, not polished non-answers. Communicate what you know, what you don\'t know, and what the next step is. Silence is the fastest path to escalation.',
  },
]

const DOC_SAMPLES = [
  {
    type:     'Runbook',
    title:    'CDP Data Pipeline — Ingest Timeout Escalation Guide',
    audience: 'Support & on-call engineers',
    sections: ['Symptom patterns', 'Upstream dependency trace (Datadog)', 'Timeout threshold reference', 'Worker allocation escalation request template', 'Customer communication templates'],
    accent:   'var(--color-accent-cyan)',
  },
  {
    type:     'Technical Spec',
    title:    'ASP.NET/ASPX Partner Portal — Badge Navigation Implementation',
    audience: 'Engineering & TAM handoff',
    sections: ['Stakeholder requirements mapping', 'ASPX page architecture', 'Salesforce data model & query design', 'Acceptance criteria checklist', 'Deployment via Perforce + IIS'],
    accent:   'var(--color-accent-crimson-lt)',
  },
  {
    type:     'Integration Guide',
    title:    'Claude API Tool-Use — Structured Data Ingestion Patterns',
    audience: 'Developers integrating Claude agents',
    sections: ['Tool schema design principles', 'Stateless agent architecture', 'Validation + fallback strategy', 'Type-safe tool call validation', 'Cost optimisation checklist'],
    accent:   'var(--color-accent-brass)',
  },
]

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
            software, cloud platforms, and developer tooling. This page documents
            the process, not just the outcomes.
          </p>

          <div style={{ display: 'flex', gap: '24px', marginTop: '32px', flexWrap: 'wrap' }}>
            {[
              { label: 'Role types',    value: 'TSE · TAM · Incident Command' },
              { label: 'Experience',    value: '5+ years'                     },
              { label: 'Environments', value: 'Windows · macOS · Linux'       },
              { label: 'Observability', value: 'Datadog · PagerDuty · Zendesk' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-text-tertiary)', marginBottom: '3px',
                }}>
                  {label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '12px',
                  color: 'var(--color-text-primary)', letterSpacing: '0.04em',
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
            exists to prevent cognitive shortcuts, the temptation to jump to a known solution
            before confirming the actual problem.
          </p>

          <div style={{ border: '1px solid var(--color-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '48px' }}>
            <TriageFlowchart />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
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
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--color-accent-brass)' }}>
                    {m.icon}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '500',
                    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-primary)',
                  }}>
                    {m.title}
                  </h3>
                </div>
                <p className="type-body" style={{ fontSize: '12px', lineHeight: '1.75' }}>{m.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Section 2: War stories ────────────────────────────────────────── */}
        <section aria-labelledby="war-story-heading" style={{ marginBottom: '96px' }}>
          <SectionEyebrow>Case Studies</SectionEyebrow>
          <SectionTitle id="war-story-heading">War Stories</SectionTitle>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {WAR_STORIES.map((story, idx) => (
              <article
                key={idx}
                aria-labelledby={`war-story-${idx}`}
                style={{
                  background:   'var(--color-bg-surface)',
                  border:       '1px solid var(--color-border)',
                  borderRadius: '2px',
                  overflow:     'hidden',
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
                    <h3 id={`war-story-${idx}`} style={{
                      fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: '600',
                      letterSpacing: '0.04em', color: 'var(--color-text-primary)', marginBottom: '6px',
                    }}>
                      {story.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: 'var(--color-text-tertiary)', letterSpacing: '0.08em',
                    }}>
                      {story.context}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '500',
                    letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px',
                    borderRadius: '2px', color: 'var(--color-accent-cyan)',
                    background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.25)',
                    whiteSpace: 'nowrap',
                  }}>
                    Resolved
                  </span>
                </div>

                {/* Outcome callout */}
                <div style={{
                  padding: '16px 24px', borderBottom: '1px solid var(--color-border)',
                  borderLeft: '3px solid var(--color-accent-cyan)', background: 'rgba(0,229,255,0.03)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '13px',
                    lineHeight: '1.7', color: 'var(--color-text-primary)',
                  }}>
                    {story.outcome}
                  </p>
                </div>

                {/* Sections */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {story.sections.map((s) => (
                    <div key={s.label}>
                      <p style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: 'var(--color-accent-brass)', marginBottom: '8px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
                        {s.label}
                      </p>
                      <p className="type-body" style={{ fontSize: '13px', lineHeight: '1.8' }}>{s.text}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Section 3: Documentation samples ─────────────────────────────── */}
        <section aria-labelledby="docs-heading" style={{ marginBottom: '80px' }}>
          <SectionEyebrow>Documentation</SectionEyebrow>
          <SectionTitle id="docs-heading">What I Write</SectionTitle>

          <p className="type-body" style={{ maxWidth: '600px', marginBottom: '40px', fontSize: '14px' }}>
            Documentation is the multiplier on resolved issues. A well-written runbook
            means the next engineer encounters the same problem for the last time.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}>
            {DOC_SAMPLES.map((doc) => (
              <article
                key={doc.title}
                style={{
                  background: 'var(--color-bg-surface)', border: '1px solid var(--color-border)',
                  borderTop: `3px solid ${doc.accent}`, borderRadius: '2px',
                  padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: doc.accent, fontWeight: '500',
                  }}>
                    {doc.type}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    letterSpacing: '0.10em', color: 'var(--color-text-tertiary)',
                  }}>
                    For: {doc.audience}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: '600',
                  letterSpacing: '0.03em', color: 'var(--color-text-primary)', lineHeight: 1.3,
                }}>
                  {doc.title}
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {doc.sections.map((s, i) => (
                    <li key={s} style={{
                      display: 'flex', alignItems: 'baseline', gap: '10px',
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: 'var(--color-text-secondary)', lineHeight: '1.5',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px',
                        color: 'var(--color-text-tertiary)', flexShrink: 0, minWidth: '16px',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                    letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
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
          borderTop: '1px solid var(--color-border)', paddingTop: '48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '20px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'var(--color-text-primary)', marginBottom: '6px',
            }}>
              Interested in working together?
            </p>
            <p className="type-body" style={{ fontSize: '13px' }}>
              View my full engineering work or reach out directly.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/projects" className="btn btn--secondary" style={{ fontSize: '11px', padding: '11px 20px' }}>
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