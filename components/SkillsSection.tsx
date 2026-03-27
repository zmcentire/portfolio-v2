'use client'

import { useState, useId } from 'react'
import { skillGroups } from '@/lib/data'

// ─── Proficiency bar ──────────────────────────────────────────────────────────
// 5 segments — filled segments glow in the tab's accent colour.
// aria-label provides the numeric level for screen readers.
function ProficiencyBar({ level, color }: { level: number; color: string }) {
  return (
    <div
      aria-label={`Proficiency level ${level} of 5`}
      role="img"
      style={{ display: 'flex', gap: '3px', flexShrink: 0 }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width:        '5px',
            height:       '12px',
            borderRadius: '1px',
            background:   i < level ? color : 'var(--color-border)',
            boxShadow:    i < level ? `0 0 4px ${color}55` : 'none',
            transition:   `background 0.3s ${i * 0.04}s, box-shadow 0.3s ${i * 0.04}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Tab accent colours ───────────────────────────────────────────────────────
const TAB_COLORS: Record<string, { accent: string; dim: string; glow: string }> = {
  Frontend:    { accent: '#00e5ff', dim: 'rgba(0,229,255,0.12)',  glow: 'rgba(0,229,255,0.20)' },
  Backend:     { accent: '#b8960c', dim: 'rgba(184,150,12,0.12)', glow: 'rgba(184,150,12,0.20)' },
  'AI & Data': { accent: '#00e5ff', dim: 'rgba(0,229,255,0.10)',  glow: 'rgba(0,229,255,0.15)' },
  Engineering: { accent: '#c0392b', dim: 'rgba(192,57,43,0.12)',  glow: 'rgba(192,57,43,0.18)' },
}

// ─── Skill pill with stagger animation ───────────────────────────────────────
function SkillPill({
  skill,
  index,
  accent,
  isNew,
}: {
  skill: { name: string; level: 1 | 2 | 3 | 4 | 5 }
  index: number
  accent: string
  isNew: boolean
}) {
  return (
    <li
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            '12px',
        padding:        '10px 14px',
        background:     'var(--color-bg-surface-2)',
        border:         '1px solid var(--color-border)',
        borderLeft:     `2px solid ${accent}`,
        borderRadius:   '2px',
        // Staggered entrance: each pill fades up with a delay based on index
        animation:      isNew ? `skillReveal 0.35s ease both` : 'none',
        animationDelay: isNew ? `${index * 0.04}s` : '0s',
      }}
    >
      <span
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '12px',
          color:         'var(--color-text-primary)',
          letterSpacing: '0.02em',
          fontWeight:    400,
        }}
      >
        {skill.name}
      </span>
      <ProficiencyBar level={skill.level} color={accent} />
    </li>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SkillsSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [prevTab,   setPrevTab]   = useState(-1)
  const baseId = useId()

  const handleTabChange = (index: number) => {
    if (index === activeTab) return
    setPrevTab(activeTab)
    setActiveTab(index)
  }

  const group  = skillGroups[activeTab]
  const colors = TAB_COLORS[group.tab] ?? TAB_COLORS['Frontend']

  return (
    <section
      aria-labelledby="skills-heading"
      style={{ borderTop: '1px solid var(--color-border)', paddingTop: '56px' }}
    >
      {/* Section header */}
      <p className="type-eyebrow" style={{ marginBottom: '8px' }}>
        <span className="accent" aria-hidden="true">// </span>Skills &amp; Stack
      </p>
      <h2
        id="skills-heading"
        className="type-h2"
        style={{ marginBottom: '8px', fontSize: 'clamp(28px, 4vw, 42px)' }}
      >
        Technical Arsenal
      </h2>
      <p
        className="type-body"
        style={{ marginBottom: '40px', fontSize: '13px' }}
      >
        {group.description}
      </p>

      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      {/* role="tablist" + role="tab" is the correct ARIA pattern for tabbed
          content. aria-selected communicates the active state. aria-controls
          points to the panel this tab controls. */}
      <div
        role="tablist"
        aria-label="Skill domains"
        style={{
          display:       'flex',
          gap:           '4px',
          marginBottom:  '24px',
          flexWrap:      'wrap',
          borderBottom:  '1px solid var(--color-border)',
          paddingBottom: '0',
        }}
      >
        {skillGroups.map((g, i) => {
          const isActive = i === activeTab
          const tc       = TAB_COLORS[g.tab] ?? TAB_COLORS['Frontend']
          return (
            <button
              key={g.tab}
              type="button"
              role="tab"
              id={`${baseId}-tab-${i}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${i}`}
              onClick={() => handleTabChange(i)}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '8px',
                padding:        '10px 18px',
                background:     isActive ? tc.dim : 'transparent',
                border:         'none',
                borderBottom:   isActive ? `2px solid ${tc.accent}` : '2px solid transparent',
                borderRadius:   '2px 2px 0 0',
                color:          isActive ? tc.accent : 'var(--color-text-secondary)',
                fontFamily:     'var(--font-mono)',
                fontSize:       '11px',
                letterSpacing:  '0.10em',
                textTransform:  'uppercase',
                cursor:         'pointer',
                transition:     'color 0.2s, background 0.2s, border-color 0.2s',
                marginBottom:   '-1px', // overlap the border-bottom
                whiteSpace:     'nowrap',
              }}
            >
              <span aria-hidden="true" style={{ fontSize: '13px' }}>{g.icon}</span>
              {g.tab}
            </button>
          )
        })}
      </div>

      {/* ── Tab panel ─────────────────────────────────────────────────────── */}
      {skillGroups.map((g, i) => {
        const tc      = TAB_COLORS[g.tab] ?? TAB_COLORS['Frontend']
        const isShown = i === activeTab

        return (
          <div
            key={g.tab}
            role="tabpanel"
            id={`${baseId}-panel-${i}`}
            aria-labelledby={`${baseId}-tab-${i}`}
            hidden={!isShown}
          >
            {isShown && (
              <>
                {/* Skill count + legend */}
                <div
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'space-between',
                    marginBottom:   '16px',
                    flexWrap:       'wrap',
                    gap:            '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color:         'var(--color-text-tertiary)',
                    }}
                  >
                    {g.skills.length} skills
                  </span>
                  {/* Proficiency legend */}
                  <div
                    style={{
                      display:    'flex',
                      alignItems: 'center',
                      gap:        '10px',
                    }}
                  >
                    {[
                      { label: 'Exposure', level: 1 },
                      { label: 'Solid',    level: 3 },
                      { label: 'Expert',   level: 5 },
                    ].map(({ label, level }) => (
                      <div
                        key={label}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ProficiencyBar level={level} color={tc.accent} />
                        <span
                          style={{
                            fontFamily:    'var(--font-mono)',
                            fontSize:      '9px',
                            letterSpacing: '0.10em',
                            textTransform: 'uppercase',
                            color:         'var(--color-text-tertiary)',
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills grid */}
                <ul
                  aria-label={`${g.category} skills`}
                  style={{
                    listStyle:           'none',
                    display:             'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap:                 '8px',
                  }}
                >
                  {g.skills.map((skill, idx) => (
                    <SkillPill
                      key={skill.name}
                      skill={skill}
                      index={idx}
                      accent={tc.accent}
                      isNew={i !== prevTab}
                    />
                  ))}
                </ul>

                {/* Category glow accent — purely decorative */}
                <div
                  aria-hidden="true"
                  style={{
                    marginTop:  '32px',
                    height:     '1px',
                    background: `linear-gradient(to right, ${tc.accent}30, transparent)`,
                  }}
                />
              </>
            )}
          </div>
        )
      })}

      {/* Keyframe injected inline — scoped so it doesn't leak globally */}
      <style>{`
        @keyframes skillReveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}