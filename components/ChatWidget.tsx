'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role:    'assistant' | 'user'
  content: string
}

// ─── Glitch text effect for assistant messages ────────────────────────────────
function GlitchText({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  return (
    <span style={{
      fontFamily:    'var(--font-mono)',
      fontSize:      '13px',
      lineHeight:    '1.75',
      color:         '#00e5ff',
      whiteSpace:    'pre-wrap',
      wordBreak:     'break-word',
    }}>
      {text}
      {isStreaming && (
        <span style={{
          display:    'inline-block',
          width:      '8px',
          height:     '13px',
          background: '#00e5ff',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          animation:  'cw-blink 0.7s step-end infinite',
        }} />
      )}
    </span>
  )
}

// ─── Chat Widget ──────────────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open,     setOpen]     = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input,    setInput]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [booted,   setBooted]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  // Boot message — fires once when widget first opens
  useEffect(() => {
    if (open && !booted) {
      setBooted(true)
      streamMessage([])
    }
  }, [open])

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const streamMessage = useCallback(async (history: Message[]) => {
    setLoading(true)
    const placeholder = { role: 'assistant' as const, content: '' }
    setMessages(prev => [...prev, placeholder])

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history }),
      })

      if (!res.ok) throw new Error('API error')

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   text    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', content: text }
          return next
        })
      }
    } catch {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', content: 'Connection error. Try again.' }
        return next
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { role: 'user', content: text }
    const history = [...messages, userMsg]
    setMessages(history)
    streamMessage(history)
  }, [input, loading, messages, streamMessage])

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-label="Chat with Zach's AI assistant"
        aria-modal={open}
        style={{
          position:   'fixed',
          bottom:     '84px',
          right:      '20px',
          width:      'min(380px, calc(100vw - 40px))',
          zIndex:     300,
          transform:  open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          opacity:    open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.28s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease',
          transformOrigin: 'bottom right',
        }}
      >
        {/* Panel frame */}
        <div style={{
          background:   'rgba(13,13,15,0.97)',
          border:       '1px solid rgba(0,229,255,0.30)',
          borderTop:    '2px solid #00e5ff',
          borderRadius: '2px',
          boxShadow:    '0 0 40px rgba(0,229,255,0.08), 0 24px 48px rgba(0,0,0,0.6)',
          overflow:     'hidden',
          display:      'flex',
          flexDirection:'column',
          height:       '460px',
        }}>

          {/* Header */}
          <div style={{
            padding:      '12px 16px',
            borderBottom: '1px solid rgba(0,229,255,0.15)',
            background:   'rgba(0,229,255,0.04)',
            display:      'flex',
            alignItems:   'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Pulse dot */}
              <span style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   '#00e5ff',
                boxShadow:    '0 0 8px #00e5ff',
                animation:    'cw-pulse 2s ease-in-out infinite',
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         '#00e5ff',
              }}>
                DUMONT // PORTFOLIO GUIDE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              style={{
                background: 'none',
                border:     'none',
                color:      'rgba(154,152,144,0.7)',
                cursor:     'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize:   '14px',
                padding:    '2px 6px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex:       1,
            overflowY:  'auto',
            padding:    '16px',
            display:    'flex',
            flexDirection: 'column',
            gap:        '12px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0,229,255,0.2) transparent',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                {msg.role === 'user' ? (
                  <div style={{
                    background:   'rgba(0,229,255,0.08)',
                    border:       '1px solid rgba(0,229,255,0.20)',
                    borderRadius: '2px',
                    padding:      '8px 12px',
                    fontFamily:   'var(--font-mono)',
                    fontSize:     '12px',
                    color:        'rgba(232,230,223,0.85)',
                    maxWidth:     '85%',
                  }}>
                    {msg.content}
                  </div>
                ) : (
                  <div style={{
                    borderLeft:  '2px solid rgba(0,229,255,0.4)',
                    paddingLeft: '10px',
                    maxWidth:    '90%',
                  }}>
                    <GlitchText
                      text={msg.content}
                      isStreaming={loading && i === messages.length - 1}
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && messages.length === 0 && (
              <div style={{ borderLeft: '2px solid rgba(0,229,255,0.4)', paddingLeft: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize:   '13px',
                  color:      'rgba(0,229,255,0.5)',
                  animation:  'cw-blink 1s step-end infinite',
                }}>
                  ▌
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding:      '12px 16px',
            borderTop:    '1px solid rgba(0,229,255,0.15)',
            background:   'rgba(0,0,0,0.3)',
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   '12px',
              color:      'rgba(0,229,255,0.5)',
              flexShrink: 0,
            }}>{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              placeholder="Ask about my experience…"
              aria-label="Chat message"
              style={{
                flex:        1,
                background:  'none',
                border:      'none',
                outline:     'none',
                fontFamily:  'var(--font-mono)',
                fontSize:    '12px',
                color:       '#e8e6df',
                caretColor:  '#00e5ff',
              }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                background:  'none',
                border:      '1px solid rgba(0,229,255,0.3)',
                borderRadius:'2px',
                color:       '#00e5ff',
                fontFamily:  'var(--font-mono)',
                fontSize:    '11px',
                padding:     '4px 10px',
                cursor:      loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity:     loading || !input.trim() ? 0.4 : 1,
                transition:  'opacity 0.2s',
              }}
            >
              ↵
            </button>
          </div>
        </div>
      </div>

      {/* ── Welcome prompt ─────────────────────────────────────────────── */}
      {!booted && !open && (
        <div
          aria-label="Chat prompt from Dumont"
          style={{
            position:    'fixed',
            bottom:      '88px',
            right:       '16px',
            zIndex:      299,
            maxWidth:    '240px',
            background:  'rgba(13,13,15,0.97)',
            border:      '1px solid rgba(0,229,255,0.30)',
            borderLeft:  '2px solid rgba(0,229,255,0.70)',
            borderRadius:'2px',
            padding:     '12px 14px',
            boxShadow:   '0 0 20px rgba(0,229,255,0.08)',
            animation:   'cw-slidein 0.4s cubic-bezier(0.16,1,0.3,1) 1.2s both',
          }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '11px',
            lineHeight:    '1.6',
            color:         '#00e5ff',
            margin:        0,
            letterSpacing: '0.02em',
          }}>
            Welcome, visitor.{' '}
            <span style={{ color: 'rgba(232,230,223,0.75)' }}>
              Want to know if Zach is the right hire?
            </span>
          </p>
          {/* Arrow pointing down-right to the button */}
          <div aria-hidden="true" style={{
            position:    'absolute',
            bottom:      '-7px',
            right:       '20px',
            width:       0,
            height:      0,
            borderLeft:  '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop:   '7px solid rgba(0,229,255,0.30)',
          }} />
        </div>
      )}

      {/* ── Trigger button ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close AI chat' : 'Open AI recruiter chat'}
        aria-expanded={open}
        style={{
          position:     'fixed',
          bottom:       '20px',
          right:        '20px',
          zIndex:       300,
          width:        '56px',
          height:       '56px',
          borderRadius: '2px',
          background:   'rgba(13,13,15,0.97)',
          border:       `1px solid ${open ? 'rgba(0,229,255,0.60)' : 'rgba(0,229,255,0.30)'}`,
          boxShadow:    open
            ? '0 0 24px rgba(0,229,255,0.25), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 0 12px rgba(0,229,255,0.10), 0 4px 16px rgba(0,0,0,0.4)',
          cursor:       'pointer',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          transition:   'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Icon: open = X, closed = terminal prompt */}
        <span style={{
          fontFamily:  'var(--font-mono)',
          fontSize:    open ? '16px' : '20px',
          color:       '#00e5ff',
          lineHeight:  1,
          transition:  'font-size 0.15s',
        }} aria-hidden="true">
          {open ? '✕' : '>_'}
        </span>

        {/* Unread dot — shown before first open */}
        {!booted && !open && (
          <span style={{
            position:     'absolute',
            top:          '8px',
            right:        '8px',
            width:        '8px',
            height:       '8px',
            borderRadius: '50%',
            background:   '#c0392b',
            boxShadow:    '0 0 6px #c0392b',
            animation:    'cw-pulse 1.5s ease-in-out infinite',
          }} />
        )}
      </button>

      {/* Scoped keyframes */}
      <style>{`
        @keyframes cw-blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes cw-pulse {
          0%,100% { opacity: 0.6; transform: scale(1);    }
          50%      { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes cw-slidein {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
      `}</style>
    </>
  )
}