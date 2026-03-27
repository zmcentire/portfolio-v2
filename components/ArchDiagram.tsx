// Architecture diagram components for each project.
// Built as pure SVG — no external library, no bundle cost.
// Fully themed with CSS custom properties from the design system.
// Each diagram shows data flow: UI → API → Data → Cloud

// ─── Shared types & helpers ───────────────────────────────────────────────────

interface NodeProps {
  x: number
  y: number
  w: number
  h: number
  label: string
  sub?: string
  tier: 'frontend' | 'backend' | 'data' | 'ai' | 'cloud' | 'external'
}

// Tier → fill/stroke colours matching the Gothic Cyberpunk palette
const TIER_STYLE: Record<NodeProps['tier'], { fill: string; stroke: string; text: string; sub: string }> = {
  frontend: { fill: 'rgba(0,229,255,0.06)',    stroke: 'rgba(0,229,255,0.35)',    text: '#00e5ff', sub: '#5a9aaa' },
  backend:  { fill: 'rgba(184,150,12,0.08)',   stroke: 'rgba(184,150,12,0.40)',   text: '#b8960c', sub: '#7a6510' },
  data:     { fill: 'rgba(139,26,26,0.10)',    stroke: 'rgba(192,57,43,0.40)',    text: '#c0392b', sub: '#7a2020' },
  ai:       { fill: 'rgba(0,229,255,0.10)',    stroke: 'rgba(0,229,255,0.55)',    text: '#00e5ff', sub: '#4a8a9a' },
  cloud:    { fill: 'rgba(58,59,74,0.60)',     stroke: 'rgba(90,89,85,0.50)',     text: '#9a9890', sub: '#5a5955' },
  external: { fill: 'rgba(26,27,36,0.80)',     stroke: 'rgba(42,43,56,0.70)',     text: '#5a5955', sub: '#3a3b4a' },
}

// Single node box
function Node({ x, y, w, h, label, sub, tier }: NodeProps) {
  const s = TIER_STYLE[tier]
  const cx = x + w / 2
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h}
        rx={2}
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={0.75}
      />
      <text
        x={cx} y={sub ? y + h / 2 - 6 : y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontFamily="'JetBrains Mono', 'Fira Code', monospace"
        fontWeight={500}
        fill={s.text}
        letterSpacing={0.5}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx} y={y + h / 2 + 9}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fontFamily="'JetBrains Mono', 'Fira Code', monospace"
          fill={s.sub}
          letterSpacing={0.3}
        >
          {sub}
        </text>
      )}
    </g>
  )
}

// Arrow between two points
function Arrow({
  x1, y1, x2, y2,
  label,
  color = 'rgba(90,89,85,0.6)',
  dashed = false,
}: {
  x1: number; y1: number; x2: number; y2: number
  label?: string
  color?: string
  dashed?: boolean
}) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return (
    <g>
      <defs>
        <marker
          id={`arrow-${x1}-${y1}`}
          viewBox="0 0 10 10"
          refX={8} refY={5}
          markerWidth={5} markerHeight={5}
          orient="auto-start-reverse"
        >
          <path d="M2 1L8 5L2 9" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={0.75}
        strokeDasharray={dashed ? '4 3' : undefined}
        markerEnd={`url(#arrow-${x1}-${y1})`}
      />
      {label && (
        <text
          x={mx} y={my - 5}
          textAnchor="middle"
          fontSize={8}
          fontFamily="'JetBrains Mono', monospace"
          fill="rgba(90,89,85,0.8)"
          letterSpacing={0.2}
        >
          {label}
        </text>
      )}
    </g>
  )
}

// Tier label (column header)
function TierLabel({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <text
      x={x} y={y}
      textAnchor="middle"
      fontSize={8}
      fontFamily="'JetBrains Mono', monospace"
      fontWeight={500}
      fill={color}
      letterSpacing={1.5}
      textDecoration="none"
      opacity={0.7}
    >
      {label.toUpperCase()}
    </text>
  )
}

// Wrapper SVG with consistent background and border
function DiagramSVG({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ display: 'block', maxWidth: '100%' }}
      aria-hidden="true"
      role="img"
    >
      {/* Background */}
      <rect width={width} height={height} fill="rgba(13,13,15,0.6)" rx={2} />
      {/* Subtle grid */}
      <defs>
        <pattern id="grid" width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42,43,56,0.4)" strokeWidth={0.4} />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#grid)" rx={2} />
      {children}
    </svg>
  )
}

// ─── TigerData Architecture ────────────────────────────────────────────────────
// Flow: Streamlit UI → FastAPI → Claude Agents → TimescaleDB → Railway
//       5 tiers left-to-right, arrows show request/response paths
export function TigerDataDiagram() {
  // Layout: 680 wide, 260 tall. 5 columns.
  const W = 680
  const H = 280
  const NODE_W = 96
  const NODE_H = 42
  const ROW1_Y = 80   // main flow row
  const ROW2_Y = 160  // secondary nodes
  const LABEL_Y = 30

  // Column centers
  const C1 = 60   // Frontend
  const C2 = 180  // API
  const C3 = 320  // AI Agents
  const C4 = 460  // Database
  const C5 = 590  // Cloud

  const nx = (cx: number) => cx - NODE_W / 2

  return (
    <DiagramSVG width={W} height={H}>
      {/* Tier labels */}
      <TierLabel x={C1} y={LABEL_Y} label="Frontend" color="#00e5ff" />
      <TierLabel x={C2} y={LABEL_Y} label="API" color="#b8960c" />
      <TierLabel x={C3} y={LABEL_Y} label="AI Agents" color="#00e5ff" />
      <TierLabel x={C4} y={LABEL_Y} label="Database" color="#c0392b" />
      <TierLabel x={C5} y={LABEL_Y} label="Cloud" color="#9a9890" />

      {/* Main flow — Row 1 */}
      <Node x={nx(C1)} y={ROW1_Y} w={NODE_W} h={NODE_H} label="Streamlit" sub="Dashboard UI" tier="frontend" />
      <Node x={nx(C2)} y={ROW1_Y} w={NODE_W} h={NODE_H} label="FastAPI" sub="REST endpoints" tier="backend" />
      <Node x={nx(C3)} y={ROW1_Y} w={NODE_W} h={NODE_H} label="Claude API" sub="Tool-use agents" tier="ai" />
      <Node x={nx(C4)} y={ROW1_Y} w={NODE_W} h={NODE_H} label="TimescaleDB" sub="Hypertables" tier="data" />
      <Node x={nx(C5)} y={ROW1_Y} w={NODE_W} h={NODE_H} label="Railway" sub="Deployment" tier="cloud" />

      {/* Secondary nodes */}
      <Node x={nx(C2)} y={ROW2_Y} w={NODE_W} h={NODE_H} label="Plotly" sub="Chart rendering" tier="frontend" />
      <Node x={nx(C4)} y={ROW2_Y} w={NODE_W} h={NODE_H} label="Cont. Aggregates" sub="1RM projections" tier="data" />

      {/* Main flow arrows */}
      <Arrow x1={C1 + NODE_W/2 - 8} y1={ROW1_Y + NODE_H/2} x2={C2 - NODE_W/2 + 6} y2={ROW1_Y + NODE_H/2} label="NL input" color="rgba(0,229,255,0.5)" />
      <Arrow x1={C2 + NODE_W/2 - 8} y1={ROW1_Y + NODE_H/2} x2={C3 - NODE_W/2 + 6} y2={ROW1_Y + NODE_H/2} label="tool calls" color="rgba(0,229,255,0.5)" />
      <Arrow x1={C3 + NODE_W/2 - 8} y1={ROW1_Y + NODE_H/2} x2={C4 - NODE_W/2 + 6} y2={ROW1_Y + NODE_H/2} label="SQL writes" color="rgba(192,57,43,0.6)" />
      <Arrow x1={C4 + NODE_W/2 - 8} y1={ROW1_Y + NODE_H/2} x2={C5 - NODE_W/2 + 6} y2={ROW1_Y + NODE_H/2} color="rgba(90,89,85,0.5)" />

      {/* API → Plotly (response with chart data) */}
      <Arrow x1={C2} y1={ROW1_Y + NODE_H} x2={C2} y2={ROW2_Y} label="chart data" color="rgba(0,229,255,0.35)" />

      {/* TimescaleDB → Cont. Aggregates */}
      <Arrow x1={C4} y1={ROW1_Y + NODE_H} x2={C4} y2={ROW2_Y} color="rgba(192,57,43,0.35)" dashed />

      {/* Cont. Aggregates → FastAPI (query response) */}
      <Arrow
        x1={C4 - NODE_W/2} y1={ROW2_Y + NODE_H/2}
        x2={C2 + NODE_W/2} y2={ROW2_Y + NODE_H/2}
        label="aggregated sets" color="rgba(192,57,43,0.4)" dashed
      />

      {/* Legend */}
      <text x={14} y={H - 16} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.6)" letterSpacing={0.3}>
        ── request  - - response / derived data
      </text>
    </DiagramSVG>
  )
}

// ─── HotZone Architecture ─────────────────────────────────────────────────────
// Flow: React UI → Firebase Auth + Firestore + Hosting
//       Simple 3-tier with Firebase as the backbone
export function HotZoneDiagram() {
  const W = 680
  const H = 240
  const NODE_W = 104
  const NODE_H = 40
  const LABEL_Y = 28

  const C1 = 80
  const C2 = 260
  const C3 = 420
  const C4 = 580

  const ROW1 = 70
  const ROW2 = 148

  const nx = (cx: number) => cx - NODE_W / 2

  return (
    <DiagramSVG width={W} height={H}>
      <TierLabel x={C1} y={LABEL_Y} label="Frontend" color="#00e5ff" />
      <TierLabel x={C2} y={LABEL_Y} label="Firebase" color="#b8960c" />
      <TierLabel x={C3} y={LABEL_Y} label="Data" color="#c0392b" />
      <TierLabel x={C4} y={LABEL_Y} label="Hosting" color="#9a9890" />

      {/* Nodes */}
      <Node x={nx(C1)} y={ROW1} w={NODE_W} h={NODE_H} label="React UI" sub="County filter" tier="frontend" />
      <Node x={nx(C2)} y={ROW1} w={NODE_W} h={NODE_H} label="Firebase SDK" sub="Client library" tier="backend" />
      <Node x={nx(C3)} y={ROW1} w={NODE_W} h={NODE_H} label="Firestore" sub="Drug protocols" tier="data" />
      <Node x={nx(C4)} y={ROW1} w={NODE_W} h={NODE_H} label="Firebase Host" sub="CDN delivery" tier="cloud" />

      {/* Secondary data collections */}
      <Node x={nx(C3) - 4} y={ROW2} w={NODE_W} h={NODE_H} label="Hospitals" sub="Utah directory" tier="data" />
      <Node x={nx(C3) + NODE_W + 8} y={ROW2} w={NODE_W} h={NODE_H} label="Fire Hazards" sub="Building types" tier="data" />

      {/* Arrows */}
      <Arrow x1={C1 + NODE_W/2 - 8} y1={ROW1 + NODE_H/2} x2={C2 - NODE_W/2 + 6} y2={ROW1 + NODE_H/2} label="SDK calls" color="rgba(0,229,255,0.5)" />
      <Arrow x1={C2 + NODE_W/2 - 8} y1={ROW1 + NODE_H/2} x2={C3 - NODE_W/2 + 6} y2={ROW1 + NODE_H/2} label="queries" color="rgba(192,57,43,0.5)" />
      <Arrow x1={C1 + NODE_W/2 - 8} y1={ROW1 + NODE_H * 0.7} x2={C4 - NODE_W/2 + 6} y2={ROW1 + NODE_H * 0.7} label="static assets" color="rgba(90,89,85,0.4)" dashed />

      {/* Firestore → sub collections */}
      <Arrow x1={C3 - 12} y1={ROW1 + NODE_H} x2={C3 - 12} y2={ROW2} color="rgba(192,57,43,0.35)" dashed />
      <Arrow x1={C3 + 16} y1={ROW1 + NODE_H} x2={C3 + 16} y2={ROW2} color="rgba(192,57,43,0.35)" dashed />

      <text x={14} y={H - 12} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.6)" letterSpacing={0.3}>
        All data reads via Firebase SDK — no separate backend server
      </text>
    </DiagramSVG>
  )
}

// ─── Stoic Quote Architecture ─────────────────────────────────────────────────
// Before/After showing the Heroku API → local JSON migration
export function StoicQuoteDiagram() {
  const W = 680
  const H = 230
  const NODE_W = 100
  const NODE_H = 38

  // Before (left half) and After (right half)
  const MID = W / 2

  return (
    <DiagramSVG width={W} height={H}>
      {/* Section labels */}
      <text x={MID / 2} y={22} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fontWeight={500} fill="rgba(192,57,43,0.8)" letterSpacing={1.2}>
        BEFORE — HEROKU
      </text>
      <text x={MID + MID / 2} y={22} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fontWeight={500} fill="rgba(0,229,255,0.8)" letterSpacing={1.2}>
        AFTER — SELF-CONTAINED
      </text>

      {/* Divider */}
      <line x1={MID} y1={10} x2={MID} y2={H - 20} stroke="rgba(42,43,56,0.8)" strokeWidth={0.75} strokeDasharray="4 3" />

      {/* BEFORE — React → API call → Heroku → quotes.json */}
      <Node x={20}  y={60} w={NODE_W} h={NODE_H} label="React App" sub="QuoteProvider" tier="frontend" />
      <Node x={140} y={60} w={NODE_W} h={NODE_H} label="fetch()" sub="HTTP request" tier="backend" />
      <Node x={260} y={60} w={NODE_W} h={NODE_H} label="Heroku API" sub="Free tier (gone)" tier="external" />

      <Arrow x1={20 + NODE_W} y1={60 + NODE_H/2} x2={140} y2={60 + NODE_H/2} color="rgba(0,229,255,0.4)" />
      <Arrow x1={140 + NODE_W} y1={60 + NODE_H/2} x2={260} y2={60 + NODE_H/2} color="rgba(90,89,85,0.4)" />

      {/* Broken indicator */}
      <text x={290} y={120} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(192,57,43,0.7)">
        ✕ cold starts
      </text>
      <text x={290} y={134} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(192,57,43,0.7)">
        ✕ free tier ended
      </text>
      <text x={290} y={148} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(192,57,43,0.7)">
        ✕ external dependency
      </text>

      {/* AFTER — React → import quotes.json (local) */}
      <Node x={MID + 20}  y={60} w={NODE_W} h={NODE_H} label="React App" sub="QuoteProvider" tier="frontend" />
      <Node x={MID + 148} y={60} w={NODE_W} h={NODE_H} label="quotes.json" sub="Local data" tier="data" />

      <Arrow x1={MID + 20 + NODE_W} y1={60 + NODE_H/2} x2={MID + 148} y2={60 + NODE_H/2} label="import" color="rgba(0,229,255,0.5)" />

      {/* Benefits */}
      <text x={MID + MID/2} y={120} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(0,229,255,0.6)">
        ✓ instant load
      </text>
      <text x={MID + MID/2} y={134} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(0,229,255,0.6)">
        ✓ no external dep
      </text>
      <text x={MID + MID/2} y={148} textAnchor="middle" fontSize={9} fontFamily="'JetBrains Mono',monospace" fill="rgba(0,229,255,0.6)">
        ✓ self-contained deploy
      </text>

      {/* Bottom note */}
      <text x={MID} y={H - 10} textAnchor="middle" fontSize={8} fontFamily="'JetBrains Mono',monospace" fill="rgba(90,89,85,0.5)" letterSpacing={0.3}>
        Migration removed the only external runtime dependency
      </text>
    </DiagramSVG>
  )
}

// ─── Diagram map — keyed by project id ────────────────────────────────────────
// ProjectCard imports this to look up whether a diagram exists for a given project.
export const ARCH_DIAGRAMS: Record<string, React.FC> = {
  tigerdata:    TigerDataDiagram,
  hotzone:      HotZoneDiagram,
  'stoic-quote': StoicQuoteDiagram,
}