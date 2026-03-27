'use client'

// "How I Ship" — DevOps / SDLC section for the About page.
// Shows the real pipeline: branch strategy → CI/CD → deploy targets.
// All SVG, no library dependencies. Animated pipeline stages pulse
// in sequence to show the flow direction.

import { useState } from 'react'

// ─── Colour aliases ───────────────────────────────────────────────────────────
const C = {
  cyan:    '#00e5ff',
  crimson: '#c0392b',
  brass:   '#b8960c',
  dim:     '#5a5955',
  text1:   '#e8e6df',
  text2:   '#9a9890',
  border:  '#2a2b38',
}

// ─── CI/CD pipeline diagram ───────────────────────────────────────────────────
// Horizontal flow: commit → lint/test → build → preview → merge → production
// Animated dots pulse along the arrows to show data flow direction.

const PIPELINE_STAGES = [
  { id: 'commit',  label: 'git push',     sub: 'feature branch', color: C.text2,   fill: 'rgba(90,89,85,0.12)',   stroke: 'rgba(90,89,85,0.40)'  },
  { id: 'ci',      label: 'CI Checks',    sub: 'lint · test',    color: C.brass,   fill: 'rgba(184,150,12,0.09)', stroke: 'rgba(184,150,12,0.42)' },
  { id: 'build',   label: 'Build',        sub: 'next build',     color: C.brass,   fill: 'rgba(184,150,12,0.09)', stroke: 'rgba(184,150,12,0.42)' },
  { id: 'preview', label: 'Preview',      sub: 'Vercel / PR URL', color: C.cyan,   fill: 'rgba(0,229,255,0.08)',  stroke: 'rgba(0,229,255,0.40)'  },
  { id: 'merge',   label: 'Merge → main', sub: 'PR approved',    color: C.text2,   fill: 'rgba(90,89,85,0.12)',   stroke: 'rgba(90,89,85,0.40)'  },
  { id: 'prod',    label: 'Production',   sub: 'auto-deploy',    color: C.cyan,    fill: 'rgba(0,229,255,0.10)',  stroke: 'rgba(0,229,255,0.55)'  },
]

function PipelineDiagram() {
  const W    = 780
  const H    = 130
  const NW   = 100
  const NH   = 48
  const GAP  = 24
  const TOTAL_W = PIPELINE_STAGES.length * NW + (PIPELINE_STAGES.length - 1) * GAP
  const START_X = (W - TOTAL_W) / 2
  const CY   = H / 2

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block' }}
      aria-label="CI/CD pipeline: git push to feature branch, through lint and test checks, build, preview deploy, PR merge, then production deploy"
      role="img"
    >
      <rect width={W} height={H} fill="rgba(13,13,15,0.60)" rx={2} />
      <defs>
        <pattern id="ship-grid" width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42,43,56,0.28)" strokeWidth={0.28} />
        </pattern>
        {/* Pulse dot marker */}
        <marker id="ship-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(0,229,255,0.40)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <rect width={W} height={H} fill="url(#ship-grid)" rx={2} />

      {PIPELINE_STAGES.map((stage, i) => {
        const x  = START_X + i * (NW + GAP)
        const cx = x + NW / 2

        // Arrow between stages
        const arrowX1 = x + NW + 2
        const arrowX2 = x + NW + GAP - 2
        const arrowMid = (arrowX1 + arrowX2) / 2

        // Label for the arrow between stages
        const ARROW_LABELS = ['', 'Actions', '', 'PR', '', '']

        return (
          <g key={stage.id}>
            {/* Node */}
            <rect x={x} y={CY - NH/2} width={NW} height={NH} rx={2}
              fill={stage.fill} stroke={stage.stroke} strokeWidth={0.75} />
            <text x={cx} y={CY - 6} textAnchor="middle" dominantBaseline="central"
              fontSize={10} fontWeight={500}
              fontFamily="'JetBrains Mono','Fira Code',monospace"
              fill={stage.color} letterSpacing={0.4}>
              {stage.label}
            </text>
            <text x={cx} y={CY + 8} textAnchor="middle" dominantBaseline="central"
              fontSize={8.5} fontFamily="'JetBrains Mono',monospace"
              fill={C.dim} letterSpacing={0.3}>
              {stage.sub}
            </text>

            {/* Arrow to next stage */}
            {i < PIPELINE_STAGES.length - 1 && (
              <g>
                <line x1={arrowX1} y1={CY} x2={arrowX2} y2={CY}
                  stroke="rgba(0,229,255,0.35)" strokeWidth={0.75}
                  markerEnd="url(#ship-arrow)" />
                {/* Animated pulse dot */}
                <circle r={2.5} fill="rgba(0,229,255,0.85)">
                  <animateMotion
                    dur={`${1.4 + i * 0.2}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.35}s`}
                    path={`M${arrowX1},${CY} L${arrowX2 - 6},${CY}`}
                  />
                  <animate attributeName="opacity"
                    values="0;1;1;0" keyTimes="0;0.1;0.8;1"
                    dur={`${1.4 + i * 0.2}s`}
                    repeatCount="indefinite"
                    begin={`${i * 0.35}s`} />
                </circle>
                {ARROW_LABELS[i] && (
                  <text x={arrowMid} y={CY - 7} textAnchor="middle"
                    fontSize={7.5} fontFamily="'JetBrains Mono',monospace"
                    fill="rgba(154,152,144,0.70)" letterSpacing={0.3}>
                    {ARROW_LABELS[i]}
                  </text>
                )}
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ─── Branch strategy diagram ──────────────────────────────────────────────────
// Shows: main ← feature/xyz with PR gate, preview env per branch

function BranchDiagram() {
  const W  = 780
  const H  = 100

  // Track positions
  const MAIN_Y    = 36
  const FEATURE_Y = 72
  const MAIN_COLOR   = C.cyan
  const FEATURE_COLOR = C.brass

  // Branch points (x positions)
  const X0 = 30   // start
  const X1 = 160  // branch off
  const X2 = 420  // PR / merge back
  const X3 = 580  // deploy
  const X4 = 740  // end

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}
      aria-label="Branch strategy: main branch with feature branches merging via pull request"
      role="img">
      <rect width={W} height={H} fill="rgba(13,13,15,0.55)" rx={2} />

      <defs>
        <marker id="br-main" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke={MAIN_COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
        <marker id="br-feat" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M2 1L8 5L2 9" fill="none" stroke={FEATURE_COLOR} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* Main branch line */}
      <line x1={X0} y1={MAIN_Y} x2={X4} y2={MAIN_Y}
        stroke={`${MAIN_COLOR}55`} strokeWidth={1.5} />

      {/* Feature branch: curves down from X1, goes right, merges at X2 */}
      <path d={`M${X1},${MAIN_Y} C${X1+30},${MAIN_Y} ${X1+30},${FEATURE_Y} ${X1+60},${FEATURE_Y} L${X2-40},${FEATURE_Y} C${X2-10},${FEATURE_Y} ${X2-10},${MAIN_Y} ${X2},${MAIN_Y}`}
        fill="none" stroke={`${FEATURE_COLOR}60`} strokeWidth={1} />

      {/* Branch point dot */}
      <circle cx={X1} cy={MAIN_Y} r={4} fill='#0d0d0f' stroke={MAIN_COLOR} strokeWidth={1.5} />

      {/* Merge point dot */}
      <circle cx={X2} cy={MAIN_Y} r={4} fill='#0d0d0f' stroke={MAIN_COLOR} strokeWidth={1.5} />

      {/* Commit dots on feature branch */}
      {[X1+100, X1+200, X1+300].map(cx => (
        <circle key={cx} cx={cx} cy={FEATURE_Y} r={3}
          fill="rgba(184,150,12,0.20)" stroke={FEATURE_COLOR} strokeWidth={0.75} />
      ))}

      {/* Deploy marker on main */}
      <circle cx={X3} cy={MAIN_Y} r={5}
        fill="rgba(0,229,255,0.12)" stroke={MAIN_COLOR} strokeWidth={1.5} />

      {/* Labels */}
      <text x={X0 + 6} y={MAIN_Y - 10} fontSize={8.5}
        fontFamily="'JetBrains Mono',monospace" fill={MAIN_COLOR} fontWeight={500} letterSpacing={0.5}>
        main
      </text>
      <text x={X1 + 60} y={FEATURE_Y + 14} fontSize={8.5}
        fontFamily="'JetBrains Mono',monospace" fill={FEATURE_COLOR} letterSpacing={0.5}>
        feature/xyz
      </text>
      <text x={X2 - 20} y={MAIN_Y - 10} fontSize={8}
        fontFamily="'JetBrains Mono',monospace" fill="rgba(154,152,144,0.80)" letterSpacing={0.3}>
        PR merge
      </text>
      <text x={X3 - 14} y={MAIN_Y + 16} fontSize={8}
        fontFamily="'JetBrains Mono',monospace" fill={MAIN_COLOR} letterSpacing={0.3} opacity={0.75}>
        deploy
      </text>

      {/* PR gate indicator */}
      <rect x={X2 - 50} y={FEATURE_Y - 10} width={46} height={16} rx={2}
        fill="rgba(0,229,255,0.07)" stroke="rgba(0,229,255,0.30)" strokeWidth={0.6} />
      <text x={X2 - 27} y={FEATURE_Y} textAnchor="middle" dominantBaseline="central"
        fontSize={7.5} fontFamily="'JetBrains Mono',monospace" fill={C.cyan} letterSpacing={0.4}>
        CI gate
      </text>
    </svg>
  )
}

// ─── Deploy platform cards ────────────────────────────────────────────────────
const PLATFORMS = [
  {
    name:     'Vercel',
    what:     'Portfolio v2 (this site)',
    trigger:  'Push to main',
    env:      'Preview per PR → Production on merge',
    detail:   'Zero-config Next.js. Preview URLs on every PR branch for stakeholder review before merge.',
    color:    C.cyan,
    icon:     '△',
  },
  {
    name:     'Railway',
    what:     'TigerData Fitness Tracker',
    trigger:  'Push to main',
    env:      'Single production environment',
    detail:   'Managed containers with automatic redeploys. FastAPI + TimescaleDB run as separate services with private networking.',
    color:    C.brass,
    icon:     '▣',
  },
  {
    name:     'Netlify',
    what:     'Stoic Timeline, Stoic Quote, Metronome',
    trigger:  'Push to main',
    env:      'Production + deploy previews',
    detail:   'CRA and React apps served via global CDN. netlify.toml pins Node version to prevent OpenSSL conflicts.',
    color:    '#3bdbac',
    icon:     '◆',
  },
  {
    name:     'Firebase Hosting',
    what:     'HotZone field resource app',
    trigger:  'GitHub Actions on merge',
    env:      'Preview channel per PR → Live on merge',
    detail:   'Actions workflow uses firebase-hosting-pull-request.yml for preview channels and firebase-hosting-merge.yml for production.',
    color:    '#f5820d',
    icon:     '⬡',
  },
]

// ─── YAML snippet ─────────────────────────────────────────────────────────────
const YAML_SNIPPET = `# .github/workflows/firebase-hosting-merge.yml
name: Deploy to Firebase on merge
on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
        env:
          NODE_OPTIONS: --openssl-legacy-provider
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: \${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: \${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live`

// ─── Main section component ───────────────────────────────────────────────────
export default function ShipSection() {
  const [expandedYaml, setExpandedYaml] = useState(false)

  return (
    <section
      aria-labelledby="ship-heading"
      style={{ borderTop: '1px solid var(--color-border)', paddingTop: '56px', marginTop: '64px' }}
    >
      {/* Header */}
      <p className="type-eyebrow" style={{ marginBottom: '8px' }}>
        <span className="accent" aria-hidden="true">// </span>DevOps &amp; SDLC
      </p>
      <h2
        id="ship-heading"
        style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(26px, 3.5vw, 38px)',
          fontWeight:    '700',
          letterSpacing: '0.04em',
          color:         'var(--color-text-primary)',
          marginBottom:  '12px',
        }}
      >
        How I Ship
      </h2>
      <p className="type-body" style={{ maxWidth: '580px', marginBottom: '40px', fontSize: '14px' }}>
        Every project goes through the same pipeline: feature branch → CI checks →
        preview deploy → PR review → production. Automated from commit to live.
      </p>

      {/* ── CI/CD Pipeline diagram ─────────────────────────────────────── */}
      <div style={{
        border:        '1px solid var(--color-border)',
        borderRadius:  '2px',
        overflow:      'hidden',
        marginBottom:  '40px',
      }}>
        <div style={{
          padding:      '10px 16px',
          borderBottom: '1px solid var(--color-border)',
          background:   'var(--color-bg-surface-2)',
          display:      'flex',
          alignItems:   'center',
          gap:          '8px',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            CI/CD Pipeline
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-tertiary)', marginLeft: 'auto' }}>
            ● animated packets = live trigger events
          </span>
        </div>
        <PipelineDiagram />
      </div>

      {/* ── Branch strategy ────────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--color-accent-brass)',
          marginBottom:  '12px',
          display:       'flex',
          alignItems:    'center',
          gap:           '6px',
        }}>
          <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
          Branch Strategy
        </p>
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
          <BranchDiagram />
        </div>
        <p className="type-body" style={{ fontSize: '12px' }}>
          Feature branches off <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent-cyan)', background: 'var(--color-bg-surface-2)', padding: '1px 5px', borderRadius: '2px', border: '1px solid var(--color-border)' }}>main</code>.
          {' '}CI gate on every push — lint + build must pass before a PR can merge.
          {' '}Preview deployment auto-generates on PR open. Merge triggers production deploy.
        </p>
      </div>

      {/* ── Deploy targets grid ────────────────────────────────────────── */}
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--color-accent-brass)',
          marginBottom:  '16px',
          display:       'flex',
          alignItems:    'center',
          gap:           '6px',
        }}>
          <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
          Deploy Targets
        </p>
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap:                 '14px',
        }}>
          {PLATFORMS.map((p) => (
            <article
              key={p.name}
              style={{
                background:   'var(--color-bg-surface)',
                border:       '1px solid var(--color-border)',
                borderTop:    `2px solid ${p.color}`,
                borderRadius: '2px',
                padding:      '18px',
              }}
            >
              {/* Platform header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', color: p.color, lineHeight: 1 }} aria-hidden="true">
                  {p.icon}
                </span>
                <h3 style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '13px',
                  fontWeight:    '500',
                  letterSpacing: '0.06em',
                  color:         'var(--color-text-primary)',
                }}>
                  {p.name}
                </h3>
              </div>

              {/* What's deployed */}
              <p style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '11px',
                color:         p.color,
                marginBottom:  '10px',
                letterSpacing: '0.03em',
              }}>
                {p.what}
              </p>

              {/* Metadata rows */}
              {[
                { label: 'Trigger', value: p.trigger },
                { label: 'Environments', value: p.env },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '6px' }}>
                  <span style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '8.5px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color:         'var(--color-text-tertiary)',
                  }}>
                    {label}
                  </span>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize:   '11px',
                    color:      'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    {value}
                  </p>
                </div>
              ))}

              {/* Detail */}
              <p className="type-body" style={{
                fontSize:   '11px',
                lineHeight: '1.65',
                marginTop:  '10px',
                paddingTop: '10px',
                borderTop:  '1px solid var(--color-border)',
              }}>
                {p.detail}
              </p>
            </article>
          ))}
        </div>
      </div>

      {/* ── YAML snippet ───────────────────────────────────────────────── */}
      <div>
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color:         'var(--color-accent-brass)',
          marginBottom:  '16px',
          display:       'flex',
          alignItems:    'center',
          gap:           '6px',
        }}>
          <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'>'}</span>
          Real Workflow — Firebase Hosting Deploy
        </p>

        <div style={{
          background:   'var(--color-bg-surface)',
          border:       '1px solid var(--color-border)',
          borderRadius: '2px',
          overflow:     'hidden',
        }}>
          {/* Code header bar */}
          <div style={{
            padding:      '10px 16px',
            borderBottom: '1px solid var(--color-border)',
            background:   'var(--color-bg-surface-2)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-secondary)', letterSpacing: '0.04em' }}>
              .github/workflows/firebase-hosting-merge.yml
            </span>
            <a
              href="https://github.com/zmcentire/Dev-Portfolio/blob/master/.github/workflows/firebase-hosting-merge.yml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View full workflow file on GitHub, opens in new tab"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color:         'var(--color-accent-cyan)',
                textDecoration: 'none',
              }}
            >
              View on GitHub ↗
            </a>
          </div>

          {/* YAML code block */}
          <div style={{ position: 'relative' }}>
            <pre style={{
              margin:      0,
              padding:     '20px',
              fontFamily:  'var(--font-mono)',
              fontSize:    '12px',
              lineHeight:  '1.7',
              color:       'var(--color-text-secondary)',
              overflowX:   'auto',
              maxHeight:   expandedYaml ? 'none' : '220px',
              overflow:    expandedYaml ? 'auto' : 'hidden',
              transition:  'max-height 0.3s ease',
            }}>
              <code>
                {YAML_SNIPPET.split('\n').map((line, i) => {
                  // Simple syntax highlight
                  let color = 'var(--color-text-secondary)'
                  if (line.trim().startsWith('#'))   color = 'var(--color-text-tertiary)'
                  if (line.includes(':') && !line.trim().startsWith('#')) {
                    const key = line.split(':')[0]
                    if (!key.includes(' ') || key.trim() === key.trim()) color = 'var(--color-text-primary)'
                  }
                  if (line.includes('${{')) color = 'var(--color-accent-brass)'
                  return (
                    <span key={i} style={{ display: 'block', color }}>
                      {line || ' '}
                    </span>
                  )
                })}
              </code>
            </pre>

            {/* Fade + expand button when collapsed */}
            {!expandedYaml && (
              <div style={{
                position:   'absolute',
                bottom:     0,
                left:       0,
                right:      0,
                height:     '80px',
                background: 'linear-gradient(to bottom, transparent, var(--color-bg-surface))',
                display:    'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '12px',
              }}>
                <button
                  type="button"
                  onClick={() => setExpandedYaml(true)}
                  className="btn btn--ghost"
                  style={{ fontSize: '10px', padding: '6px 16px' }}
                >
                  Show full workflow
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="type-body" style={{ fontSize: '12px', marginTop: '12px' }}>
          This workflow runs on every merge to <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent-cyan)', background: 'var(--color-bg-surface-2)', padding: '1px 5px', borderRadius: '2px', border: '1px solid var(--color-border)' }}>main</code> and
          {' '}deploys to Firebase Hosting production. A parallel workflow (
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-surface-2)', padding: '1px 5px', borderRadius: '2px', border: '1px solid var(--color-border)' }}>firebase-hosting-pull-request.yml</code>
          ) creates preview channels on every open PR.
        </p>
      </div>

    </section>
  )
}