'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Character limit for JD input ─────────────────────────────────────────────
const JD_MAX = 3000

// ─── Token helper — rough word count ─────────────────────────────────────────
function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ─── Blinking cursor ──────────────────────────────────────────────────────────
function Cursor() {
  return (
    <span
      aria-hidden="true"
      style={{
        display:       'inline-block',
        width:         '2px',
        height:        '1em',
        background:    'var(--color-accent-cyan)',
        marginLeft:    '2px',
        verticalAlign: 'text-bottom',
        animation:     'bp-blink 0.9s step-end infinite',
      }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BioPersonalizer() {
  const [jd,        setJd]        = useState('')
  const [roleHint,  setRoleHint]  = useState('')
  const [output,    setOutput]    = useState('')
  const [prevOut,   setPrevOut]   = useState('')  // fades out while new streams in
  const [loading,   setLoading]   = useState(false)
  const [copied,    setCopied]    = useState(false)
  const [error,     setError]     = useState('')
  const outputRef                 = useRef<HTMLDivElement>(null)
  const textareaRef               = useRef<HTMLTextAreaElement>(null)

  const jdLength    = jd.length
  const jdOverLimit = jdLength > JD_MAX
  const canGenerate = jd.trim().length > 40 && !jdOverLimit && !loading
  const hasOutput   = output.length > 0

  // ── Keyboard shortcut: Cmd/Ctrl+Enter ────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (canGenerate) handleGenerate()
      }
    }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [canGenerate, jd, roleHint])

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return
    setLoading(true)
    setPrevOut(output)   // keep previous visible during fade
    setOutput('')
    setError('')

    try {
      const res = await fetch('/api/personalize', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ jobDescription: jd, roleHint }),
      })

      if (!res.ok) {
        const msg = res.status === 400 ? 'Please enter a job description.' :
                    res.status === 500 ? 'API not configured — add ANTHROPIC_API_KEY to environment variables.' :
                    'Something went wrong. Please try again.'
        throw new Error(msg)
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   text    = ''
      setPrevOut('')    // clear fade-out once stream begins

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setOutput(text)
      }

      // Scroll output into view after stream completes
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
      setOutput('')
      setPrevOut('')
    } finally {
      setLoading(false)
    }
  }, [canGenerate, jd, roleHint, output])

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setJd('')
    setRoleHint('')
    setOutput('')
    setPrevOut('')
    setError('')
    textareaRef.current?.focus()
  }

  // ── Shared label style ────────────────────────────────────────────────────
  const labelStyle: React.CSSProperties = {
    display:       'block',
    fontFamily:    'var(--font-mono)',
    fontSize:      '9px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color:         'var(--color-text-tertiary)',
    marginBottom:  '8px',
  }

  const subLabelStyle: React.CSSProperties = {
    fontFamily:    'var(--font-mono)',
    fontSize:      '9px',
    letterSpacing: '0.10em',
    color:         'var(--color-text-tertiary)',
    marginLeft:    'auto',
  }

  return (
    <section
      aria-labelledby="personalizer-heading"
      style={{
        marginTop:    '72px',
        borderTop:    '1px solid var(--color-border)',
        paddingTop:   '56px',
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <p className="type-eyebrow" style={{ marginBottom: '8px' }}>
        <span className="accent" aria-hidden="true">// </span>AI-Powered Tool
      </p>
      <h2
        id="personalizer-heading"
        style={{
          fontFamily:    'var(--font-display)',
          fontSize:      'clamp(24px, 3.5vw, 36px)',
          fontWeight:    '700',
          letterSpacing: '0.04em',
          color:         'var(--color-text-primary)',
          marginBottom:  '12px',
        }}
      >
        Recruiter Bio Personalizer
      </h2>
      <p className="type-body" style={{ maxWidth: '560px', marginBottom: '40px', fontSize: '14px' }}>
        Paste a job description. Claude rewrites my professional summary to match
        the language and priorities of that specific role — live, in your browser.
      </p>

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div style={{
        background:   'var(--color-bg-surface)',
        border:       '1px solid var(--color-border)',
        borderTop:    '2px solid var(--color-accent-cyan)',
        borderRadius: '2px',
        overflow:     'hidden',
      }}>

        {/* Card header bar */}
        <div style={{
          padding:      '12px 20px',
          borderBottom: '1px solid var(--color-border)',
          background:   'var(--color-bg-surface-2)',
          display:      'flex',
          alignItems:   'center',
          gap:          '8px',
        }}>
          <span style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   loading ? 'var(--color-accent-brass)' : 'var(--color-accent-cyan)',
            boxShadow:    loading ? '0 0 8px var(--color-accent-brass)' : '0 0 6px var(--color-accent-cyan)',
            flexShrink:   0,
            transition:   'background 0.3s, box-shadow 0.3s',
            animation:    loading ? 'bp-pulse 1.2s ease-in-out infinite' : 'none',
          }} aria-hidden="true" />
          <span style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'var(--color-text-tertiary)',
          }}>
            {loading ? 'Generating…' : hasOutput ? 'Ready' : 'Awaiting input'}
          </span>
          {(hasOutput || error) && !loading && (
            <button
              type="button"
              onClick={handleReset}
              style={{
                marginLeft:    'auto',
                fontFamily:    'var(--font-mono)',
                fontSize:      '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                background:    'none',
                border:        '1px solid var(--color-border)',
                borderRadius:  '2px',
                color:         'var(--color-text-tertiary)',
                padding:       '3px 10px',
                cursor:        'pointer',
                transition:    'color 0.2s, border-color 0.2s',
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Card body */}
        <div style={{ padding: '24px' }}>

          {/* ── JD textarea ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="jd-input" style={labelStyle}>
                Job Description
              </label>
              <span style={{
                ...subLabelStyle,
                color: jdOverLimit ? 'var(--color-accent-crimson-lt)' : 'var(--color-text-tertiary)',
              }}>
                {jdLength.toLocaleString()} / {JD_MAX.toLocaleString()}
              </span>
            </div>
            <textarea
              id="jd-input"
              ref={textareaRef}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here… (Cmd/Ctrl+Enter to generate)"
              rows={9}
              aria-describedby={jdOverLimit ? 'jd-overlimit' : undefined}
              style={{
                width:        '100%',
                background:   'var(--color-bg-surface-2)',
                border:       `1px solid ${jdOverLimit ? 'var(--color-accent-crimson-lt)' : 'var(--color-border)'}`,
                borderRadius: '2px',
                padding:      '14px',
                color:        'var(--color-text-primary)',
                fontFamily:   'var(--font-mono)',
                fontSize:     '13px',
                lineHeight:   '1.65',
                resize:       'vertical',
                outline:      'none',
                transition:   'border-color 0.2s',
                boxSizing:    'border-box',
              }}
              onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                if (!jdOverLimit) e.target.style.borderColor = 'rgba(0,229,255,0.35)'
              }}
              onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                e.target.style.borderColor = jdOverLimit
                  ? 'var(--color-accent-crimson-lt)'
                  : 'var(--color-border)'
              }}
            />
            {jdOverLimit && (
              <p id="jd-overlimit" role="alert" style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    '11px',
                color:       'var(--color-accent-crimson-lt)',
                marginTop:   '6px',
              }}>
                Trim to under {JD_MAX.toLocaleString()} characters for best results
              </p>
            )}
          </div>

          {/* ── Role hint ───────────────────────────────────────────────── */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="role-hint" style={{ ...labelStyle, marginBottom: '6px' }}>
              Role targeting hint{' '}
              <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                — optional
              </span>
            </label>
            <input
              id="role-hint"
              type="text"
              value={roleHint}
              onChange={(e) => setRoleHint(e.target.value)}
              placeholder="e.g. 'Lean into TAM experience' or 'Emphasise Claude API work'"
              maxLength={200}
              style={{
                width:        '100%',
                background:   'var(--color-bg-surface-2)',
                border:       '1px solid var(--color-border)',
                borderRadius: '2px',
                padding:      '10px 14px',
                color:        'var(--color-text-primary)',
                fontFamily:   'var(--font-mono)',
                fontSize:     '12px',
                outline:      'none',
                transition:   'border-color 0.2s',
                boxSizing:    'border-box' as const,
              }}
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(0,229,255,0.35)' }}
              onBlur={(e: React.FocusEvent<HTMLInputElement>)  => { e.target.style.borderColor = 'var(--color-border)' }}
            />
            <p style={{
              fontFamily:  'var(--font-mono)',
              fontSize:    '10px',
              color:       'var(--color-text-tertiary)',
              marginTop:   '6px',
              letterSpacing: '0.03em',
            }}>
              Guide Claude toward a specific angle — domain, skill, or story you want to lead with.
            </p>
          </div>

          {/* ── Actions ─────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              aria-busy={loading}
              className="btn btn--primary"
              style={{
                padding:   '11px 22px',
                fontSize:  '11px',
                opacity:   canGenerate ? 1 : 0.4,
                cursor:    canGenerate ? 'pointer' : 'not-allowed',
                display:   'flex',
                alignItems:'center',
                gap:       '8px',
                transition:'opacity 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span aria-hidden="true" style={{ display: 'inline-block', animation: 'bp-spin 1s linear infinite' }}>⟳</span>
                  Generating…
                </>
              ) : hasOutput ? 'Regenerate ↗' : 'Generate ↗'}
            </button>

            <p style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '9px',
              letterSpacing: '0.10em',
              color:         'var(--color-text-tertiary)',
              textTransform: 'uppercase',
            }}>
              {canGenerate ? 'Cmd/Ctrl+Enter' : jd.trim().length < 40 ? 'Paste a JD to continue' : ''}
            </p>
          </div>

          {/* ── Error ───────────────────────────────────────────────────── */}
          {error && (
            <div role="alert" style={{
              marginTop:    '16px',
              padding:      '12px 16px',
              background:   'rgba(192,57,43,0.07)',
              border:       '1px solid rgba(192,57,43,0.30)',
              borderLeft:   '2px solid var(--color-accent-crimson-lt)',
              borderRadius: '2px',
            }}>
              <p style={{
                fontFamily:  'var(--font-mono)',
                fontSize:    '12px',
                color:       'var(--color-accent-crimson-lt)',
                lineHeight:  '1.6',
              }}>
                {error}
              </p>
            </div>
          )}

          {/* ── Output ──────────────────────────────────────────────────── */}
          {/* Previous output fades while new one streams in */}
          {prevOut && !output && (
            <div style={{ marginTop: '28px', opacity: 0.3, transition: 'opacity 0.4s', pointerEvents: 'none' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.85' }}>
                {prevOut}
              </p>
            </div>
          )}

          {output && (
            <div ref={outputRef} style={{ marginTop: '28px' }}>
              {/* Output header */}
              <div style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                marginBottom:   '12px',
                flexWrap:       'wrap',
                gap:            '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <p style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '9px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'var(--color-accent-brass)',
                  }}>
                    <span aria-hidden="true" style={{ color: 'var(--color-accent-crimson-lt)' }}>{'> '}</span>
                    Tailored Summary
                  </p>
                  {!loading && (
                    <span style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '9px',
                      color:         'var(--color-text-tertiary)',
                      letterSpacing: '0.06em',
                    }}>
                      {wordCount(output)} words
                    </span>
                  )}
                </div>
                {!loading && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="btn btn--ghost"
                    style={{ fontSize: '10px', padding: '5px 12px' }}
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>

              {/* Output text */}
              <div style={{
                background:   'var(--color-bg-surface-2)',
                border:       '1px solid var(--color-border)',
                borderLeft:   '2px solid var(--color-accent-cyan)',
                borderRadius: '2px',
                padding:      '20px 22px',
                fontFamily:   'var(--font-mono)',
                fontSize:     '14px',
                lineHeight:   '1.90',
                color:        'var(--color-text-primary)',
                minHeight:    '80px',
              }}>
                {output}
                {loading && <Cursor />}
              </div>

              {/* Usage note */}
              {!loading && (
                <p style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '10px',
                  color:         'var(--color-text-tertiary)',
                  marginTop:     '10px',
                  letterSpacing: '0.04em',
                }}>
                  This bio is generated fresh on each request. Tweak the hint and regenerate to explore different angles.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scoped keyframes */}
      <style>{`
        @keyframes bp-spin  { to { transform: rotate(360deg); } }
        @keyframes bp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes bp-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>
    </section>
  )
}