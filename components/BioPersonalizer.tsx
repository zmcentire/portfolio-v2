'use client'

import { useState, useRef } from 'react'

export default function BioPersonalizer() {
  const [jd, setJd]           = useState('')
  const [output, setOutput]   = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')
  const outputRef             = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    if (!jd.trim() || loading) return
    setLoading(true)
    setOutput('')
    setError('')

    try {
      const res = await fetch('/api/personalize', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ jobDescription: jd }),
      })

      if (!res.ok) throw new Error('Request failed')

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   text    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setOutput(text)
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      aria-labelledby="personalizer-heading"
      style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderLeft:   '3px solid var(--cyan)',
        borderRadius: '2px',
        padding:      '32px',
        marginTop:    '64px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontFamily:    'var(--font-mono)', fontSize: '10px',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color:         'var(--cyan)', marginBottom: '8px',
        }}>
          AI-Powered
        </p>
        <h2
          id="personalizer-heading"
          style={{
            fontFamily: 'var(--font-display)', fontSize: '22px',
            fontWeight: '600', color: 'var(--text-1)', marginBottom: '8px',
          }}
        >
          Recruiter Bio Personalizer
        </h2>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '13px',
          lineHeight: '1.7', color: 'var(--text-2)', maxWidth: '560px',
        }}>
          Paste a job description below. Claude will rewrite my professional summary
          to match the language and priorities of that specific role.
        </p>
      </div>

      {/* Input */}
      <div style={{ marginBottom: '16px' }}>
        <label
          htmlFor="jd-input"
          style={{
            display:       'block',
            fontFamily:    'var(--font-mono)', fontSize: '10px',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color:         'var(--text-2)', marginBottom: '8px',
          }}
        >
          Job Description
        </label>
        <textarea
          id="jd-input"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          style={{
            width:          '100%',
            background:     'var(--surface-2)',
            border:         '1px solid var(--border)',
            borderRadius:   '2px',
            padding:        '14px',
            color:          'var(--text-1)',
            fontFamily:     'var(--font-mono)',
            fontSize:       '13px',
            lineHeight:     '1.6',
            resize:         'vertical',
            outline:        'none',
            transition:     'border-color 0.2s',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--border-hover)' }}
          onBlur={(e)  => { e.target.style.borderColor = 'var(--border)' }}
        />
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !jd.trim()}
        aria-busy={loading}
        style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '12px', fontWeight: '700',
          letterSpacing: '0.10em', textTransform: 'uppercase',
          padding:       '12px 24px',
          background:    loading || !jd.trim() ? 'var(--surface-2)' : 'var(--cyan)',
          color:         loading || !jd.trim() ? 'var(--text-3)' : 'var(--obsidian)',
          border:        'none', borderRadius: '2px',
          cursor:        loading || !jd.trim() ? 'not-allowed' : 'pointer',
          transition:    'background 0.2s, color 0.2s',
          display:       'flex', alignItems: 'center', gap: '8px',
        }}
      >
        {loading ? (
          <>
            <span aria-hidden="true" style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
            Generating...
          </>
        ) : (
          'Generate ↗'
        )}
      </button>

      {/* Error */}
      {error && (
        <p role="alert" style={{
          fontFamily: 'var(--font-mono)', fontSize: '12px',
          color: 'var(--crimson-lt)', marginTop: '12px',
        }}>
          {error}
        </p>
      )}

      {/* Output */}
      {output && (
        <div ref={outputRef} style={{ marginTop: '28px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '12px',
          }}>
            <p style={{
              fontFamily:    'var(--font-mono)', fontSize: '10px',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color:         'var(--brass)',
            }}>
              {'> '} Tailored Summary
            </p>
            <button
              onClick={handleCopy}
              style={{
                fontFamily:    'var(--font-mono)', fontSize: '10px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                padding:       '6px 12px',
                background:    'var(--surface-2)',
                border:        '1px solid var(--border)',
                borderRadius:  '2px',
                color:         copied ? 'var(--cyan)' : 'var(--text-2)',
                cursor:        'pointer',
                transition:    'color 0.2s, border-color 0.2s',
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div
            style={{
              background:   'var(--surface-2)',
              border:       '1px solid var(--border)',
              borderLeft:   '2px solid var(--cyan)',
              borderRadius: '2px',
              padding:      '20px',
              fontFamily:   'var(--font-mono)',
              fontSize:     '14px',
              lineHeight:   '1.85',
              color:        'var(--text-1)',
            }}
          >
            {output}
            {loading && (
              <span
                aria-hidden="true"
                style={{
                  display:         'inline-block',
                  width:           '2px', height:  '16px',
                  background:      'var(--cyan)',
                  marginLeft:      '3px',
                  verticalAlign:   'middle',
                  animation:       'blink 1s step-end infinite',
                }}
              />
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </section>
  )
}
