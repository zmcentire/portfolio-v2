'use client'

// Architecture diagram components — pure animated SVG, no library.
// Each diagram: themed nodes, animated data-flow pulses on arrows,
// hover tooltips for richer context, collision-safe marker IDs via useId.
//
// Deliberately avoids React Flow (@xyflow/react) — 150kb+ for static
// portfolio diagrams that recruiters read rather than interact with.
// CSS animation gives equivalent visual richness at zero bundle cost.

import { useState, useId } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Tier = 'frontend' | 'backend' | 'data' | 'ai' | 'cloud' | 'external'

interface NodeDef {
  x: number; y: number; w: number; h: number
  label: string; sub?: string; tier: Tier
  tooltip?: string   // shown on hover
}

interface ArrowDef {
  x1: number; y1: number; x2: number; y2: number
  label?: string; color?: string; dashed?: boolean
  pulse?: boolean   // animated dot flowing along the arrow
}

// ─── Tier colour palette ──────────────────────────────────────────────────────
const TIER: Record<Tier, { fill: string; stroke: string; text: string; sub: string; glow: string }> = {
  frontend: { fill: 'rgba(0,229,255,0.07)',   stroke: 'rgba(0,229,255,0.40)',   text: '#00e5ff', sub: '#4a8a9a', glow: 'rgba(0,229,255,0.20)'   },
  backend:  { fill: 'rgba(184,150,12,0.09)',  stroke: 'rgba(184,150,12,0.42)',  text: '#b8960c', sub: '#7a6510', glow: 'rgba(184,150,12,0.18)'  },
  data:     { fill: 'rgba(139,26,26,0.11)',   stroke: 'rgba(192,57,43,0.42)',   text: '#c0392b', sub: '#7a2020', glow: 'rgba(192,57,43,0.18)'   },
  ai:       { fill: 'rgba(0,229,255,0.12)',   stroke: 'rgba(0,229,255,0.60)',   text: '#00e5ff', sub: '#4a8a9a', glow: 'rgba(0,229,255,0.28)'   },
  cloud:    { fill: 'rgba(58,59,74,0.55)',    stroke: 'rgba(90,89,85,0.48)',    text: '#9a9890', sub: '#5a5955', glow: 'rgba(90,89,85,0.18)'    },
  external: { fill: 'rgba(26,27,36,0.85)',    stroke: 'rgba(42,43,56,0.65)',    text: '#5a5955', sub: '#3a3b4a', glow: 'rgba(42,43,56,0.15)'    },
}

// ─── Node component ───────────────────────────────────────────────────────────
function DiagramNode({
  x, y, w, h, label, sub, tier, tooltip,
}: NodeDef) {
  const [hovered, setHovered] = useState(false)
  const s  = TIER[tier]
  const cx = x + w / 2
  const cy = y + h / 2

  return (
    <g
      onMouseEnter={() => tooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: tooltip ? 'default' : undefined }}
    >
      {/* Glow halo on hover */}
      {hovered && (
        <rect
          x={x - 3} y={y - 3}
          width={w + 6} height={h + 6}
          rx={4}
          fill="none"
          stroke={s.glow}
          strokeWidth={4}
          style={{ filter: `blur(4px)` }}
        />
      )}
      {/* Node body */}
      <rect
        x={x} y={y} width={w} height={h}
        rx={2}
        fill={hovered ? s.fill.replace(/[\d.]+\)$/, '0.14)') : s.fill}
        stroke={s.stroke}
        strokeWidth={hovered ? 1 : 0.75}
        style={{ transition: 'fill 0.2s, stroke-width 0.2s' }}
      />
      {/* Label */}
      <text
        x={cx} y={sub ? cy - 7 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontFamily="'JetBrains Mono','Fira Code',monospace"
        fontWeight={500}
        fill={s.text}
        letterSpacing={0.5}
      >
        {label}
      </text>
      {/* Sub-label */}
      {sub && (
        <text
          x={cx} y={cy + 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontFamily="'JetBrains Mono','Fira Code',monospace"
          fill={s.sub}
          letterSpacing={0.3}
        >
          {sub}
        </text>
      )}
      {/* Tooltip */}
      {hovered && tooltip && (
        <g>
          <rect
            x={cx - 90} y={y - 38}
            width={180} height={30}
            rx={2}
            fill="rgba(13,13,15,0.96)"
            stroke="rgba(42,43,56,0.9)"
            strokeWidth={0.75}
          />
          <text
            x={cx} y={y - 23}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={9}
            fontFamily="'JetBrains Mono',monospace"
            fill="rgba(232,230,223,0.85)"
            letterSpacing={0.3}
          >
            {tooltip}
          </text>
        </g>
      )}
    </g>
  )
}

// ─── Arrow + optional pulse dot ───────────────────────────────────────────────
function DiagramArrow({
  x1, y1, x2, y2, label, color = 'rgba(90,89,85,0.55)',
  dashed = false, pulse = false, markerId,
}: ArrowDef & { markerId: string }) {
  const mx  = (x1 + x2) / 2
  const my  = (y1 + y2) / 2
  // Path length for animateMotion
  const dx  = x2 - x1
  const dy  = y2 - y1

  return (
    <g>
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX={8} refY={5}
          markerWidth={5} markerHeight={5}
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray={dashed ? '4 3' : undefined}
        markerEnd={`url(#${markerId})`}
      />

      {/* Animated pulse dot — represents a data packet in flight */}
      {pulse && (
        <circle r={2.5} fill={color} opacity={0.9}>
          <animateMotion
            dur={`${1.8 + Math.abs(dx + dy) * 0.004}s`}
            repeatCount="indefinite"
            path={`M${x1},${y1} L${x2},${y2}`}
          />
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            dur={`${1.8 + Math.abs(dx + dy) * 0.004}s`}
            repeatCount="indefinite"
          />
        </circle>
      )}

      {label && (
        <text
          x={mx} y={my - 6}
          textAnchor="middle"
          fontSize={8}
          fontFamily="'JetBrains Mono',monospace"
          fill="rgba(154,152,144,0.80)"
          letterSpacing={0.2}
        >
          {label}
        </text>
      )}
    </g>
  )
}

// ─── Column header label ──────────────────────────────────────────────────────
function ColLabel({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontSize={8}
      fontFamily="'JetBrains Mono',monospace"
      fontWeight={500}
      fill={color}
      letterSpacing={1.5}
      opacity={0.75}
    >
      {label.toUpperCase()}
    </text>
  )
}

// ─── SVG wrapper with grid background ────────────────────────────────────────
function DiagramSVG({
  width, height, children, label,
}: { width: number; height: number; children: React.ReactNode; label: string }) {
  const gridId = useId().replace(/:/g, '')
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label={label}
      role="img"
    >
      <defs>
        <pattern id={`grid-${gridId}`} width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42,43,56,0.35)" strokeWidth={0.35} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="rgba(13,13,15,0.65)" rx={2} />
      <rect width={width} height={height} fill={`url(#grid-${gridId})`} rx={2} />
      {children}
    </svg>
  )
}

// ─── Legend row ───────────────────────────────────────────────────────────────
function Legend({ y, text, W }: { y: number; text: string; W: number }) {
  return (
    <text
      x={14} y={y}
      fontSize={8}
      fontFamily="'JetBrains Mono',monospace"
      fill="rgba(90,89,85,0.55)"
      letterSpacing={0.3}
    >
      {text}
    </text>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIGERDATA — Agentic AI pipeline
// Flow: Streamlit UI → FastAPI → Claude Agents → TimescaleDB → Railway
// ═══════════════════════════════════════════════════════════════════════════════
export function TigerDataDiagram() {
  const id    = useId().replace(/:/g, '')
  const W     = 680
  const H     = 290
  const NW    = 96
  const NH    = 42
  const R1    = 82
  const R2    = 168
  const LY    = 30
  const C1    = 62
  const C2    = 185
  const C3    = 330
  const C4    = 468
  const C5    = 594
  const nx    = (c: number) => c - NW / 2

  const nodes: NodeDef[] = [
    { x: nx(C1), y: R1, w: NW, h: NH, label: 'Streamlit',      sub: 'Dashboard UI',    tier: 'frontend', tooltip: 'Python UI framework — renders Plotly charts in-browser' },
    { x: nx(C2), y: R1, w: NW, h: NH, label: 'FastAPI',         sub: 'REST endpoints',  tier: 'backend',  tooltip: 'Async Python API — orchestrates Claude tool calls'       },
    { x: nx(C3), y: R1, w: NW, h: NH, label: 'Claude API',      sub: 'Tool-use agents', tier: 'ai',       tooltip: 'Parses natural-language input into structured SQL writes' },
    { x: nx(C4), y: R1, w: NW, h: NH, label: 'TimescaleDB',     sub: 'Hypertables',     tier: 'data',     tooltip: 'Time-series DB — 1-week chunks, <20ms write latency'     },
    { x: nx(C5), y: R1, w: NW, h: NH, label: 'Railway',         sub: 'Deployment',      tier: 'cloud',    tooltip: 'Managed container hosting — zero-downtime deploys'       },
    { x: nx(C2), y: R2, w: NW, h: NH, label: 'Plotly',          sub: 'Chart rendering', tier: 'frontend', tooltip: 'Interactive visualizations streamed back to Streamlit'    },
    { x: nx(C4), y: R2, w: NW, h: NH, label: 'Cont. Agg.',      sub: '1RM projections', tier: 'data',     tooltip: 'Pre-computed 7d/30d rolling aggregates — <100ms reads'   },
  ]

  const arrows: (ArrowDef & { markerId: string })[] = [
    { x1: C1+NW/2-6, y1: R1+NH/2, x2: C2-NW/2+6, y2: R1+NH/2, label: 'NL input',       color: 'rgba(0,229,255,0.50)',  pulse: true,  markerId: `${id}-a1` },
    { x1: C2+NW/2-6, y1: R1+NH/2, x2: C3-NW/2+6, y2: R1+NH/2, label: 'tool calls',     color: 'rgba(0,229,255,0.50)',  pulse: true,  markerId: `${id}-a2` },
    { x1: C3+NW/2-6, y1: R1+NH/2, x2: C4-NW/2+6, y2: R1+NH/2, label: 'SQL writes',     color: 'rgba(192,57,43,0.55)',  pulse: true,  markerId: `${id}-a3` },
    { x1: C4+NW/2-6, y1: R1+NH/2, x2: C5-NW/2+6, y2: R1+NH/2,                          color: 'rgba(90,89,85,0.45)',               markerId: `${id}-a4` },
    { x1: C2,        y1: R1+NH,   x2: C2,         y2: R2,      label: 'chart data',     color: 'rgba(0,229,255,0.30)',  pulse: true,  markerId: `${id}-a5` },
    { x1: C4,        y1: R1+NH,   x2: C4,         y2: R2,                                color: 'rgba(192,57,43,0.30)',  dashed: true, markerId: `${id}-a6` },
    { x1: C4-NW/2,   y1: R2+NH/2, x2: C2+NW/2,   y2: R2+NH/2, label: 'aggregated sets', color: 'rgba(192,57,43,0.38)',  dashed: true, pulse: true, markerId: `${id}-a7` },
  ]

  return (
    <DiagramSVG width={W} height={H} label="TigerData architecture — data flow from Streamlit UI through FastAPI and Claude agents to TimescaleDB and Railway">
      <ColLabel x={C1} y={LY} label="Frontend" color="#00e5ff" />
      <ColLabel x={C2} y={LY} label="API"      color="#b8960c" />
      <ColLabel x={C3} y={LY} label="AI Layer" color="#00e5ff" />
      <ColLabel x={C4} y={LY} label="Database" color="#c0392b" />
      <ColLabel x={C5} y={LY} label="Cloud"    color="#9a9890" />

      {arrows.map((a) => <DiagramArrow key={a.markerId} {...a} />)}
      {nodes.map((n)  => <DiagramNode  key={n.label}   {...n} />)}

      <Legend y={H - 16} text="── request / write   - - derived / aggregated   ● animated data packet" W={W} />
    </DiagramSVG>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// HOTZONE — Firebase field resource app
// Flow: React UI → Firebase SDK → Firestore collections → Firebase Hosting
// ═══════════════════════════════════════════════════════════════════════════════
export function HotZoneDiagram() {
  const id  = useId().replace(/:/g, '')
  const W   = 680
  const H   = 252
  const NW  = 106
  const NH  = 40
  const LY  = 28
  const C1  = 80
  const C2  = 250
  const C3  = 420
  const C4  = 588
  const R1  = 68
  const R2  = 152
  const nx  = (c: number) => c - NW / 2

  const nodes: NodeDef[] = [
    { x: nx(C1), y: R1, w: NW, h: NH, label: 'React UI',      sub: 'County filter',   tier: 'frontend', tooltip: 'Mobile-first UI — 2-tap max depth to any data'         },
    { x: nx(C2), y: R1, w: NW, h: NH, label: 'Firebase SDK',  sub: 'Client library',  tier: 'backend',  tooltip: 'Direct client SDK — no backend server required'         },
    { x: nx(C3), y: R1, w: NW, h: NH, label: 'Firestore',     sub: 'Protocols',       tier: 'data',     tooltip: 'NoSQL with offline persistence — reads survive no signal' },
    { x: nx(C4), y: R1, w: NW, h: NH, label: 'Firebase Host', sub: 'CDN delivery',    tier: 'cloud',    tooltip: 'Global CDN — static assets served at the edge'           },
    { x: nx(C3) - 6,       y: R2, w: NW, h: NH, label: 'Hospitals',    sub: 'Utah directory',  tier: 'data',     tooltip: 'All Utah hospitals with quick-reference contact data'    },
    { x: nx(C3) + NW + 10, y: R2, w: NW, h: NH, label: 'Fire Hazards', sub: 'Building types',  tier: 'data',     tooltip: 'Hazard ratings indexed by building construction type'    },
  ]

  const arrows: (ArrowDef & { markerId: string })[] = [
    { x1: C1+NW/2-6, y1: R1+NH/2,        x2: C2-NW/2+6, y2: R1+NH/2,        label: 'SDK calls',    color: 'rgba(0,229,255,0.50)',  pulse: true,  markerId: `${id}-a1` },
    { x1: C2+NW/2-6, y1: R1+NH/2,        x2: C3-NW/2+6, y2: R1+NH/2,        label: 'queries',      color: 'rgba(192,57,43,0.50)',  pulse: true,  markerId: `${id}-a2` },
    { x1: C1+NW/2-6, y1: R1+NH*0.7,      x2: C4-NW/2+6, y2: R1+NH*0.7,      label: 'static assets', color: 'rgba(90,89,85,0.38)', dashed: true, markerId: `${id}-a3` },
    { x1: C3-14,      y1: R1+NH,          x2: C3-14,      y2: R2,                                    color: 'rgba(192,57,43,0.32)',  dashed: true, markerId: `${id}-a4` },
    { x1: C3+14,      y1: R1+NH,          x2: C3+14,      y2: R2,                                    color: 'rgba(192,57,43,0.32)',  dashed: true, markerId: `${id}-a5` },
  ]

  return (
    <DiagramSVG width={W} height={H} label="HotZone architecture — React UI reads directly from Firebase Firestore via client SDK">
      <ColLabel x={C1} y={LY} label="Frontend"  color="#00e5ff" />
      <ColLabel x={C2} y={LY} label="SDK"       color="#b8960c" />
      <ColLabel x={C3} y={LY} label="Firestore" color="#c0392b" />
      <ColLabel x={C4} y={LY} label="Hosting"   color="#9a9890" />

      {arrows.map((a) => <DiagramArrow key={a.markerId} {...a} />)}
      {nodes.map((n)  => <DiagramNode  key={n.label}   {...n} />)}

      <text x={14} y={H - 12} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.55)" letterSpacing={0.3}>
        No backend server — all reads via Firebase client SDK with built-in offline persistence
      </text>
    </DiagramSVG>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// STOIC QUOTE — Before/After migration diagram
// Left: React → fetch() → Heroku API (broken)
// Right: React → import quotes.json (self-contained)
// ═══════════════════════════════════════════════════════════════════════════════
export function StoicQuoteDiagram() {
  const id  = useId().replace(/:/g, '')
  const W   = 680
  const H   = 238
  const NW  = 100
  const NH  = 38
  const MID = W / 2

  const nodes: NodeDef[] = [
    { x: 18,         y: 58, w: NW, h: NH, label: 'React App',   sub: 'QuoteProvider',   tier: 'frontend', tooltip: 'Renders random quote on button press'              },
    { x: 138,        y: 58, w: NW, h: NH, label: 'fetch()',     sub: 'HTTP request',    tier: 'backend',  tooltip: 'Async API call — blocked on cold start, CORS issues' },
    { x: 258,        y: 58, w: NW, h: NH, label: 'Heroku API',  sub: 'Free tier (gone)', tier: 'external', tooltip: 'Heroku free dynos ended Nov 2022 — API went offline' },
    { x: MID + 18,   y: 58, w: NW, h: NH, label: 'React App',  sub: 'QuoteProvider',   tier: 'frontend', tooltip: 'Same component — fetch() replaced with static import' },
    { x: MID + 148,  y: 58, w: NW, h: NH, label: 'quotes.json', sub: 'Local data',     tier: 'data',     tooltip: '30+ quotes bundled at build time — zero network cost' },
  ]

  const arrows: (ArrowDef & { markerId: string })[] = [
    { x1: 18+NW,      y1: 58+NH/2, x2: 138,      y2: 58+NH/2, color: 'rgba(0,229,255,0.38)',  markerId: `${id}-a1` },
    { x1: 138+NW,     y1: 58+NH/2, x2: 258,      y2: 58+NH/2, color: 'rgba(90,89,85,0.35)',   markerId: `${id}-a2` },
    { x1: MID+18+NW,  y1: 58+NH/2, x2: MID+148,  y2: 58+NH/2, label: 'import', color: 'rgba(0,229,255,0.55)', pulse: true, markerId: `${id}-a3` },
  ]

  const bad  = [['✕ cold starts', 108], ['✕ free tier ended', 122], ['✕ external dep', 136]] as [string, number][]
  const good = [['✓ instant load', 108], ['✓ no network dep', 122], ['✓ self-contained', 136]] as [string, number][]

  return (
    <DiagramSVG width={W} height={H} label="Stoic Quote migration — before (Heroku API) and after (local JSON)">
      {/* Section labels */}
      <text x={MID/2}     y={22} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fontWeight={500} fill="rgba(192,57,43,0.8)" letterSpacing={1.2}>BEFORE — HEROKU</text>
      <text x={MID+MID/2} y={22} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fontWeight={500} fill="rgba(0,229,255,0.8)"  letterSpacing={1.2}>AFTER — LOCAL</text>

      {/* Divider */}
      <line x1={MID} y1={10} x2={MID} y2={H-20} stroke="rgba(42,43,56,0.8)" strokeWidth={0.75} strokeDasharray="4 3" />

      {arrows.map((a) => <DiagramArrow key={a.markerId} {...a} />)}
      {nodes.map((n)  => <DiagramNode  key={`${n.x}-${n.label}`}  {...n} />)}

      {bad.map(([t, y])  => <text key={t} x={290} y={y} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(192,57,43,0.72)">{t}</text>)}
      {good.map(([t, y]) => <text key={t} x={MID+MID/2} y={y} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(0,229,255,0.65)">{t}</text>)}

      <text x={MID} y={H-10} textAnchor="middle" fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.50)" letterSpacing={0.3}>
        Migration removed the only external runtime dependency — hover nodes for detail
      </text>
    </DiagramSVG>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// POLY PLATFORM — Angular frontend with backend analytics
// Flow: Angular SPA → REST API → org database + analytics pipeline
// ═══════════════════════════════════════════════════════════════════════════════
export function PolyDiagram() {
  const id  = useId().replace(/:/g, '')
  const W   = 680
  const H   = 260
  const NW  = 106
  const NH  = 40
  const LY  = 28
  const C1  = 82
  const C2  = 248
  const C3  = 420
  const C4  = 585
  const R1  = 68
  const R2  = 154
  const nx  = (c: number) => c - NW / 2

  const nodes: NodeDef[] = [
    { x: nx(C1), y: R1, w: NW, h: NH, label: 'Angular SPA',   sub: 'Component lib',  tier: 'frontend', tooltip: 'Reusable action cards, navigation, typography system' },
    { x: nx(C2), y: R1, w: NW, h: NH, label: 'REST API',      sub: 'Org endpoints',  tier: 'backend',  tooltip: 'Handles org membership, event scheduling, permissions'  },
    { x: nx(C3), y: R1, w: NW, h: NH, label: 'Org Database',  sub: 'Members/events', tier: 'data',     tooltip: 'Stores organization membership and event relationships'  },
    { x: nx(C4), y: R1, w: NW, h: NH, label: 'Auth Layer',    sub: 'Access control', tier: 'cloud',    tooltip: 'Role-based access — org admins vs members'             },
    { x: nx(C2), y: R2, w: NW, h: NH, label: 'Feed Engine',   sub: 'Interest match', tier: 'backend',  tooltip: 'Ranks events by member interest overlap score'           },
    { x: nx(C3), y: R2, w: NW, h: NH, label: 'Analytics DB',  sub: 'Engagement data',tier: 'data',     tooltip: 'Aggregates engagement for org-level reporting dashboards' },
  ]

  const arrows: (ArrowDef & { markerId: string })[] = [
    { x1: C1+NW/2-6, y1: R1+NH/2, x2: C2-NW/2+6, y2: R1+NH/2, label: 'API requests', color: 'rgba(0,229,255,0.50)',  pulse: true,  markerId: `${id}-a1` },
    { x1: C2+NW/2-6, y1: R1+NH/2, x2: C3-NW/2+6, y2: R1+NH/2, label: 'queries',      color: 'rgba(192,57,43,0.50)',  pulse: true,  markerId: `${id}-a2` },
    { x1: C3+NW/2-6, y1: R1+NH/2, x2: C4-NW/2+6, y2: R1+NH/2, label: 'auth check',   color: 'rgba(90,89,85,0.40)',               markerId: `${id}-a3` },
    { x1: C2,        y1: R1+NH,   x2: C2,         y2: R2,      label: 'feed score',   color: 'rgba(184,150,12,0.42)', dashed: true, markerId: `${id}-a4` },
    { x1: C2+NW/2-6, y1: R2+NH/2, x2: C3-NW/2+6, y2: R2+NH/2, label: 'events data',  color: 'rgba(184,150,12,0.42)', pulse: true,  markerId: `${id}-a5` },
    { x1: C1+NW/2-6, y1: R2+NH/2, x2: C2-NW/2+6, y2: R2+NH/2, label: 'ranked feed',  color: 'rgba(0,229,255,0.35)',  dashed: true, markerId: `${id}-a6` },
  ]

  return (
    <DiagramSVG width={W} height={H} label="Poly Platform architecture — Angular SPA consuming REST API with interest-based feed engine">
      <ColLabel x={C1} y={LY} label="Frontend"  color="#00e5ff" />
      <ColLabel x={C2} y={LY} label="API / Logic" color="#b8960c" />
      <ColLabel x={C3} y={LY} label="Database"  color="#c0392b" />
      <ColLabel x={C4} y={LY} label="Auth"      color="#9a9890" />

      {arrows.map((a) => <DiagramArrow key={a.markerId} {...a} />)}
      {nodes.map((n)  => <DiagramNode  key={n.label}   {...n} />)}

      <text x={14} y={H - 12} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.55)" letterSpacing={0.3}>
        Hover any node for implementation detail   ● animated packet = live data flow
      </text>
    </DiagramSVG>
  )
}

// ─── Diagram registry ─────────────────────────────────────────────────────────
// Keyed by project id — ProjectCard and case study pages look up by id.
// Adding a new diagram: define it above and add one entry here.
export const ARCH_DIAGRAMS: Record<string, React.FC> = {
  tigerdata:    TigerDataDiagram,
  hotzone:      HotZoneDiagram,
  poly:         PolyDiagram,
  'stoic-quote': StoicQuoteDiagram,
}