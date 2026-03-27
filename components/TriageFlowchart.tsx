'use client'

// Triage flowchart — a branching decision tree, not a linear flow.
// Real issue triage has yes/no decision points; a linear diagram
// would misrepresent the process. This shows the actual branch points:
// reproduce? → isolate layer? → known pattern? → escalate or resolve.
//
// Built as pure SVG matching the ArchDiagram visual system.
// Hover any node for the reasoning behind that decision point.

import { useState } from 'react'

// ─── Colour roles ─────────────────────────────────────────────────────────────
const C = {
  cyan:    '#00e5ff',
  crimson: '#c0392b',
  brass:   '#b8960c',
  dim:     '#5a5955',
  text1:   '#e8e6df',
  text2:   '#9a9890',
  surface: '#13141a',
  border:  '#2a2b38',
  bg:      '#0d0d0f',
}

// ─── Node shapes ──────────────────────────────────────────────────────────────
type Shape = 'rect' | 'diamond' | 'terminal' | 'action'

interface FlowNode {
  id:      string
  x:       number
  y:       number
  w:       number
  h:       number
  shape:   Shape
  label:   string
  sub?:    string
  fill:    string
  stroke:  string
  color:   string
  tooltip: string
}

interface FlowEdge {
  from: { x: number; y: number }
  to:   { x: number; y: number }
  label?: string
  color?: string
  path?: string   // SVG path override for bent routes
}

// ─── Diamond (decision) points ────────────────────────────────────────────────
function Diamond({ x, y, w, h, fill, stroke }: { x: number; y: number; w: number; h: number; fill: string; stroke: string }) {
  const cx = x + w / 2
  const cy = y + h / 2
  const pts = `${cx},${y} ${x+w},${cy} ${cx},${y+h} ${x},${cy}`
  return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={0.75} />
}

// ─── Node renderer ────────────────────────────────────────────────────────────
function Node({ node }: { node: FlowNode }) {
  const [hovered, setHovered] = useState(false)
  const { x, y, w, h, shape, label, sub, fill, stroke, color, tooltip } = node
  const cx = x + w / 2
  const cy = y + h / 2

  const hoverFill = fill.replace(/[\d.]+\)$/, m => `${Math.min(parseFloat(m) * 2, 0.28)})`)

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      {/* Shape */}
      {shape === 'diamond' ? (
        <Diamond x={x} y={y} w={w} h={h} fill={hovered ? hoverFill : fill} stroke={stroke} />
      ) : shape === 'terminal' ? (
        <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={hovered ? hoverFill : fill} stroke={stroke} strokeWidth={0.75} />
      ) : (
        <rect x={x} y={y} width={w} height={h} rx={2} fill={hovered ? hoverFill : fill} stroke={hovered ? color : stroke} strokeWidth={hovered ? 1 : 0.75} style={{ transition: 'fill 0.18s, stroke 0.18s' }} />
      )}

      {/* Label */}
      <text
        x={cx} y={sub ? cy - 7 : cy}
        textAnchor="middle" dominantBaseline="central"
        fontSize={10} fontWeight={500}
        fontFamily="'JetBrains Mono','Fira Code',monospace"
        fill={color} letterSpacing={0.4}
      >
        {label}
      </text>
      {sub && (
        <text
          x={cx} y={cy + 7}
          textAnchor="middle" dominantBaseline="central"
          fontSize={8.5}
          fontFamily="'JetBrains Mono','Fira Code',monospace"
          fill={C.dim} letterSpacing={0.3}
        >
          {sub}
        </text>
      )}

      {/* Tooltip */}
      {hovered && (
        <g>
          <rect
            x={cx - 110} y={y - 44}
            width={220} height={36}
            rx={2}
            fill="rgba(13,13,15,0.97)"
            stroke={C.border}
            strokeWidth={0.75}
          />
          {tooltip.split(' · ').map((line, i) => (
            <text
              key={i}
              x={cx} y={y - 44 + 12 + i * 13}
              textAnchor="middle" dominantBaseline="central"
              fontSize={8.5}
              fontFamily="'JetBrains Mono',monospace"
              fill="rgba(232,230,223,0.80)"
              letterSpacing={0.25}
            >
              {line}
            </text>
          ))}
        </g>
      )}
    </g>
  )
}

// ─── Edge (arrow) renderer ────────────────────────────────────────────────────
let markerKey = 0
function Edge({ edge, id }: { edge: FlowEdge; id: string }) {
  const { from, to, label, color = C.dim, path } = edge
  const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
  const d   = path ?? `M${from.x},${from.y} L${to.x},${to.y}`

  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={0.75} markerEnd={`url(#${id})`} />
      {label && (
        <text
          x={mid.x + 4} y={mid.y}
          textAnchor="start" dominantBaseline="central"
          fontSize={8}
          fontFamily="'JetBrains Mono',monospace"
          fill="rgba(154,152,144,0.85)"
          letterSpacing={0.3}
        >
          {label}
        </text>
      )}
    </g>
  )
}

// ─── Main flowchart ───────────────────────────────────────────────────────────
export default function TriageFlowchart() {
  const W   = 800
  const H   = 560
  // Node dimensions
  const RW  = 130  // rect width
  const RH  = 36   // rect height
  const DW  = 110  // diamond width
  const DH  = 44   // diamond height
  const TW  = 140  // terminal width
  const TH  = 32   // terminal height
  const AW  = 120  // action width
  const AH  = 32   // action height

  // X columns
  const COL1 = 60    // left branch
  const COL2 = 335   // centre spine
  const COL3 = 590   // right branch

  // Y rows
  const Y0  = 30   // Start terminal
  const Y1  = 100  // Collect symptoms
  const Y2  = 172  // Decision: reproducible?
  const Y3  = 248  // Gather more info (left branch)
  const Y4  = 248  // Reproduce confirmed (right = centre)
  const Y5  = 320  // Decision: layer isolated?
  const Y6  = 396  // Decision: known pattern?
  const Y7  = 396  // Escalate (right)
  const Y8  = 468  // Resolve + document
  const Y9  = 468  // Known fix apply (left)

  // Centre X of each column
  const cx2 = COL2 + RW / 2
  const cx1 = COL1 + AW / 2
  const cx3 = COL3 + AW / 2

  // ── Node definitions ──────────────────────────────────────────────────────
  const nodes: FlowNode[] = [
    // Start terminal
    {
      id: 'start', x: COL2 + (RW-TW)/2, y: Y0, w: TW, h: TH, shape: 'terminal',
      label: 'Issue Reported', fill: 'rgba(0,229,255,0.08)', stroke: C.cyan,
      color: C.cyan, tooltip: 'Any channel: support ticket · Slack · direct',
    },
    // Collect symptoms
    {
      id: 'collect', x: COL2, y: Y1, w: RW, h: RH, shape: 'rect',
      label: 'Collect Symptoms', sub: 'env · steps · errors · timeline',
      fill: 'rgba(184,150,12,0.08)', stroke: 'rgba(184,150,12,0.40)',
      color: C.brass, tooltip: 'Never skip this · Half of root causes are in the context · not the symptom',
    },
    // Decision: reproducible?
    {
      id: 'repro-q', x: COL2 + (RW-DW)/2, y: Y2, w: DW, h: DH, shape: 'diamond',
      label: 'Reproducible?', fill: 'rgba(90,89,85,0.12)', stroke: 'rgba(90,89,85,0.45)',
      color: C.text2, tooltip: 'Can you make it happen on demand? · If not — gather more env data first',
    },
    // Left: gather more info
    {
      id: 'more-info', x: COL1, y: Y3, w: AW, h: AH, shape: 'action',
      label: 'Gather More Info', sub: 'logs · repro env',
      fill: 'rgba(92,57,43,0.10)', stroke: 'rgba(192,57,43,0.35)',
      color: C.crimson, tooltip: 'Request: error logs · exact versions · network traces · reproduction environment',
    },
    // Centre: reproduce confirmed — isolate layer
    {
      id: 'isolate', x: COL2, y: Y4, w: RW, h: RH, shape: 'rect',
      label: 'Isolate Layer', sub: 'UI → API → DB → Cloud',
      fill: 'rgba(184,150,12,0.08)', stroke: 'rgba(184,150,12,0.40)',
      color: C.brass, tooltip: 'Work outside-in · Confirm each layer before going deeper · halves search space each step',
    },
    // Decision: layer isolated?
    {
      id: 'isolated-q', x: COL2 + (RW-DW)/2, y: Y5, w: DW, h: DH, shape: 'diamond',
      label: 'Layer Isolated?', fill: 'rgba(90,89,85,0.12)', stroke: 'rgba(90,89,85,0.45)',
      color: C.text2, tooltip: 'Can you pinpoint which layer owns the failure? · If unclear — add more instrumentation',
    },
    // Right: escalate
    {
      id: 'escalate', x: COL3, y: Y7, w: AW, h: AH, shape: 'action',
      label: 'Escalate', sub: 'with full packet',
      fill: 'rgba(139,26,26,0.12)', stroke: 'rgba(192,57,43,0.40)',
      color: C.crimson, tooltip: 'Escalate with: repro steps · layers eliminated · current hypothesis · specific ask',
    },
    // Decision: known pattern?
    {
      id: 'known-q', x: COL2 + (RW-DW)/2, y: Y6, w: DW, h: DH, shape: 'diamond',
      label: 'Known Pattern?', fill: 'rgba(90,89,85,0.12)', stroke: 'rgba(90,89,85,0.45)',
      color: C.text2, tooltip: 'Check runbook · previous tickets · team knowledge base before investigating from scratch',
    },
    // Left: apply known fix
    {
      id: 'known-fix', x: COL1, y: Y9, w: AW, h: AH, shape: 'action',
      label: 'Apply Known Fix', sub: 'runbook / precedent',
      fill: 'rgba(0,229,255,0.07)', stroke: 'rgba(0,229,255,0.35)',
      color: C.cyan, tooltip: 'Apply the documented fix · verify resolution · update runbook if pattern changed',
    },
    // Centre: resolve + document
    {
      id: 'resolve', x: COL2 + (RW-TW)/2, y: Y8, w: TW, h: TH, shape: 'terminal',
      label: 'Resolve + Document', fill: 'rgba(0,229,255,0.09)', stroke: C.cyan,
      color: C.cyan, tooltip: 'Resolution is not the end · Write root cause · update runbook · notify stakeholders',
    },
  ]

  // ── Edge definitions ────────────────────────────────────────────────────
  const diagPrefix = `tf-${Math.random().toString(36).slice(2, 7)}`

  const edges: (FlowEdge & { id: string })[] = [
    // Start → Collect
    {
      id: `${diagPrefix}-e1`,
      from: { x: cx2, y: Y0 + TH },
      to:   { x: cx2, y: Y1 },
    },
    // Collect → Decision: reproducible?
    {
      id: `${diagPrefix}-e2`,
      from: { x: cx2, y: Y1 + RH },
      to:   { x: cx2, y: Y2 },
    },
    // Decision → No (left): gather more info
    {
      id: `${diagPrefix}-e3`,
      from: { x: COL2 + (RW-DW)/2, y: Y2 + DH/2 },
      to:   { x: cx1, y: Y3 },
      label: 'No',
      color: C.crimson,
      path: `M${COL2+(RW-DW)/2},${Y2+DH/2} L${cx1},${Y2+DH/2} L${cx1},${Y3}`,
    },
    // Decision → Yes (centre): isolate
    {
      id: `${diagPrefix}-e4`,
      from: { x: cx2, y: Y2 + DH },
      to:   { x: cx2, y: Y4 },
      label: 'Yes',
      color: C.cyan,
    },
    // Gather more info loops back up to collect
    {
      id: `${diagPrefix}-e5`,
      from: { x: COL1, y: Y3 + AH/2 },
      to:   { x: COL2, y: Y1 + RH/2 },
      label: 'retry',
      color: 'rgba(192,57,43,0.45)',
      path: `M${COL1},${Y3+AH/2} L${COL1-20},${Y3+AH/2} L${COL1-20},${Y1+RH/2} L${COL2},${Y1+RH/2}`,
    },
    // Isolate → Decision: layer isolated?
    {
      id: `${diagPrefix}-e6`,
      from: { x: cx2, y: Y4 + RH },
      to:   { x: cx2, y: Y5 },
    },
    // Layer isolated → No (right): escalate
    {
      id: `${diagPrefix}-e7`,
      from: { x: COL2 + RW, y: Y5 + DH/2 },
      to:   { x: cx3, y: Y7 },
      label: 'No',
      color: C.crimson,
      path: `M${COL2+RW},${Y5+DH/2} L${cx3},${Y5+DH/2} L${cx3},${Y7}`,
    },
    // Layer isolated → Yes (centre): known pattern?
    {
      id: `${diagPrefix}-e8`,
      from: { x: cx2, y: Y5 + DH },
      to:   { x: cx2, y: Y6 },
      label: 'Yes',
      color: C.cyan,
    },
    // Known pattern → Yes (left): apply known fix
    {
      id: `${diagPrefix}-e9`,
      from: { x: COL2 + (RW-DW)/2, y: Y6 + DH/2 },
      to:   { x: cx1, y: Y9 },
      label: 'Yes',
      color: C.cyan,
      path: `M${COL2+(RW-DW)/2},${Y6+DH/2} L${cx1},${Y6+DH/2} L${cx1},${Y9}`,
    },
    // Known pattern → No (centre): resolve by investigation
    {
      id: `${diagPrefix}-e10`,
      from: { x: cx2, y: Y6 + DH },
      to:   { x: cx2, y: Y8 },
      label: 'No — investigate',
      color: C.brass,
    },
    // Apply known fix → resolve
    {
      id: `${diagPrefix}-e11`,
      from: { x: cx1 + AW, y: Y9 + AH/2 },
      to:   { x: COL2 + (RW-TW)/2 + TW, y: Y8 + TH/2 },
      color: C.cyan,
      path: `M${cx1+AW/2},${Y9} L${cx1+AW/2},${Y8+TH/2} L${COL2+(RW-TW)/2+TW},${Y8+TH/2}`,
    },
    // Escalate → resolve (after resolution)
    {
      id: `${diagPrefix}-e12`,
      from: { x: cx3, y: Y7 + AH },
      to:   { x: COL2 + (RW-TW)/2 + TW, y: Y8 + TH * 0.4 },
      color: 'rgba(192,57,43,0.40)',
      path: `M${cx3},${Y7+AH} L${cx3},${Y8+TH*0.4} L${COL2+(RW-TW)/2+TW},${Y8+TH*0.4}`,
    },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ display: 'block', maxWidth: '100%' }}
      aria-label="Issue triage decision flowchart — from symptom collection through layer isolation to resolution or escalation"
      role="img"
    >
      {/* Background */}
      <rect width={W} height={H} fill="rgba(13,13,15,0.70)" rx={2} />
      <defs>
        <pattern id="triage-grid" width={20} height={20} patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(42,43,56,0.30)" strokeWidth={0.30} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#triage-grid)" rx={2} />

      {/* Column labels */}
      {[
        { x: cx1, label: 'Gather / Retry', color: C.crimson },
        { x: cx2, label: 'Main Triage Path', color: C.cyan },
        { x: cx3, label: 'Escalate', color: C.crimson },
      ].map(({ x, label, color }) => (
        <text key={label} x={x} y={16} textAnchor="middle" fontSize={8} fontFamily="'JetBrains Mono',monospace" fontWeight={500} fill={color} letterSpacing={1.2} opacity={0.6}>
          {label.toUpperCase()}
        </text>
      ))}

      {/* Edges rendered before nodes so nodes sit on top */}
      {edges.map((e) => <Edge key={e.id} edge={e} id={e.id} />)}

      {/* Nodes */}
      {nodes.map((n) => <Node key={n.id} node={n} />)}

      {/* Legend */}
      <g>
        <rect x={14} y={H - 28} width={6} height={6} rx={1} fill="rgba(0,229,255,0.20)" stroke={C.cyan} strokeWidth={0.75} />
        <text x={24} y={H - 22} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill={C.dim}>= process step</text>
        <polygon points={`148,${H-24} 162,${H-21} 148,${H-18} 134,${H-21}`} fill="rgba(90,89,85,0.15)" stroke="rgba(90,89,85,0.45)" strokeWidth={0.75} />
        <text x={168} y={H - 22} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill={C.dim}>= decision point</text>
        <rect x={302} y={H - 27} width={50} height={12} rx={6} fill="rgba(0,229,255,0.08)" stroke={C.cyan} strokeWidth={0.75} />
        <text x={360} y={H - 22} fontSize={8} fontFamily="'JetBrains Mono',monospace" fill={C.dim}>= start / end   hover nodes for detail</text>
      </g>
    </svg>
  )
}