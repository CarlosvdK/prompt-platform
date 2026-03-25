'use client'

import { useState, useEffect } from 'react'

const CYCLE_DURATION = 8000
const STEP_1_END = 2500
const STEP_2_END = 5000

const codeLines = [
  { text: 'export default function Hero() {', delay: 0 },
  { text: '  return (', delay: 150 },
  { text: '    <section className="min-h-screen bg-zinc-950">', delay: 300 },
  { text: '      <div className="max-w-7xl mx-auto px-6 py-24">', delay: 450 },
  { text: '        <h1 className="text-6xl font-bold">', delay: 600 },
  { text: '          Welcome to the Future', delay: 750 },
  { text: '        </h1>', delay: 900 },
  { text: '        <p className="text-xl text-zinc-400 mt-6">', delay: 1050 },
  { text: '          Built with AI, shipped in seconds', delay: 1200 },
  { text: '        </p>', delay: 1350 },
  { text: '      </div>', delay: 1500 },
  { text: '    </section>', delay: 1650 },
  { text: '  )', delay: 1800 },
  { text: '}', delay: 1950 },
]

const miniCards = [
  { color: '#667eea', label: 'Hero' },
  { color: '#764ba2', label: 'Cards' },
  { color: '#f093fb', label: 'Navbar' },
  { color: '#4f46e5', label: 'Login' },
  { color: '#22d3ee', label: 'Footer' },
  { color: '#a855f7', label: 'Pricing' },
]

export function HeroDemo() {
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(0)
  const [highlightedCard, setHighlightedCard] = useState(-1)
  const [showCopied, setShowCopied] = useState(false)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showReady, setShowReady] = useState(false)

  // Only render after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let active = true

    const runCycle = () => {
      if (!active) return

      setStep(0)
      setHighlightedCard(-1)
      setShowCopied(false)
      setVisibleLines(0)
      setShowReady(false)

      const t1 = setTimeout(() => { if (active) setHighlightedCard(0) }, 1000)
      const t2 = setTimeout(() => { if (active) { setStep(1); setHighlightedCard(-1) } }, STEP_1_END)
      const t3 = setTimeout(() => { if (active) setShowCopied(true) }, STEP_1_END + 600)
      const t4 = setTimeout(() => { if (active) { setStep(2); setShowCopied(false) } }, STEP_2_END)

      const lineTimers: NodeJS.Timeout[] = []
      codeLines.forEach((line, i) => {
        lineTimers.push(setTimeout(() => { if (active) setVisibleLines(i + 1) }, STEP_2_END + 400 + line.delay))
      })

      const t5 = setTimeout(() => { if (active) setShowReady(true) }, STEP_2_END + 2400)

      return [t1, t2, t3, t4, t5, ...lineTimers]
    }

    let timers = runCycle()
    const interval = setInterval(() => {
      timers?.forEach(clearTimeout)
      timers = runCycle()
    }, CYCLE_DURATION)

    return () => {
      active = false
      clearInterval(interval)
      timers?.forEach(clearTimeout)
    }
  }, [mounted])

  if (!mounted) {
    // SSR placeholder to avoid hydration mismatch
    return (
      <div className="glass-card rounded-2xl overflow-hidden w-full" style={{ minHeight: 420 }}>
        <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <div className="p-8" style={{ minHeight: 380 }} />
      </div>
    )
  }

  const stepLabels = ['STEP 1 — BROWSE', 'STEP 2 — COPY', 'STEP 3 — BUILD']

  return (
    <div className="glass-card rounded-2xl overflow-hidden w-full">
      {/* Mac window chrome */}
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>
        <span className="text-xs text-[#64748b] font-mono">softset.dev</span>
      </div>

      {/* Content area */}
      <div className="relative p-8" style={{ minHeight: 380 }}>
        {/* Step label */}
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-6 transition-all duration-300"
          style={{ color: '#667eea' }}
        >
          {stepLabels[step]}
        </p>

        {/* Step 0: Browse */}
        <div
          className="absolute inset-8 top-20 transition-all duration-500"
          style={{ opacity: step === 0 ? 1 : 0, transform: step === 0 ? 'translateY(0)' : 'translateY(-20px)', pointerEvents: step === 0 ? 'auto' : 'none' }}
        >
          <div className="grid grid-cols-3 gap-3">
            {miniCards.map((card, i) => (
              <div
                key={card.label}
                className="rounded-xl p-4 transition-all duration-500"
                style={{
                  background: `${card.color}15`,
                  border: highlightedCard === i ? `2px solid ${card.color}` : '2px solid transparent',
                  boxShadow: highlightedCard === i ? `0 0 20px ${card.color}30` : 'none',
                  transform: highlightedCard === i ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div className="w-full h-2 rounded-full mb-3" style={{ background: `${card.color}40` }} />
                <div className="w-full h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="w-3/4 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <p className="text-[10px] text-[#64748b] mt-3 font-medium">{card.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Copy */}
        <div
          className="absolute inset-8 top-20 transition-all duration-500"
          style={{ opacity: step === 1 ? 1 : 0, transform: step === 1 ? 'translateY(0)' : 'translateY(20px)', pointerEvents: step === 1 ? 'auto' : 'none' }}
        >
          <div
            className="rounded-xl p-5 font-mono text-xs leading-relaxed relative"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p style={{ color: '#667eea' }}>
              Create a hero section component
              <span style={{ color: '#64748b' }}> for a SaaS landing page. Use a full-width dark background (bg-zinc-950), centered content with max-w-7xl, a large heading with gradient text effect, subtitle paragraph, and two CTA buttons. Make it responsive with min-h-screen. Include subtle background gradient orbs...</span>
            </p>
          </div>

          {/* Copied toast */}
          <div
            className="absolute top-0 right-0 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-300"
            style={{
              background: showCopied ? 'rgba(34,197,94,0.15)' : 'transparent',
              color: '#22c55e',
              border: showCopied ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
              opacity: showCopied ? 1 : 0,
              transform: showCopied ? 'translateY(0)' : 'translateY(-10px)',
            }}
          >
            ✓ Copied to clipboard
          </div>
        </div>

        {/* Step 2: Build */}
        <div
          className="absolute inset-8 top-20 transition-all duration-500"
          style={{ opacity: step === 2 ? 1 : 0, transform: step === 2 ? 'translateY(0)' : 'translateY(20px)', pointerEvents: step === 2 ? 'auto' : 'none' }}
        >
          <div
            className="rounded-xl p-5 font-mono text-[13px] leading-relaxed"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {codeLines.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="flex gap-3 transition-all duration-200"
                style={{ opacity: i < visibleLines ? 1 : 0 }}
              >
                <span className="text-[#64748b] select-none w-5 text-right shrink-0">{i + 1}</span>
                <span>
                  {line.text.includes('export') || line.text.includes('function') ? (
                    <><span style={{ color: '#c084fc' }}>export default function</span><span style={{ color: '#22d3ee' }}> Hero</span><span style={{ color: '#e2e8f0' }}>() {'{'}</span></>
                  ) : line.text.includes('className') ? (
                    <span style={{ color: '#fbbf24' }}>{line.text}</span>
                  ) : line.text.includes('return') ? (
                    <><span style={{ color: '#c084fc' }}>  return</span><span style={{ color: '#e2e8f0' }}> (</span></>
                  ) : line.text.includes('<h1') || line.text.includes('<p') || line.text.includes('<section') || line.text.includes('<div') ? (
                    <span style={{ color: '#4ade80' }}>{line.text}</span>
                  ) : line.text.includes('</') ? (
                    <span style={{ color: '#4ade80' }}>{line.text}</span>
                  ) : line.text.includes('}') || line.text.includes(')') ? (
                    <span style={{ color: '#e2e8f0' }}>{line.text}</span>
                  ) : (
                    <span style={{ color: '#e2e8f0' }}>{line.text}</span>
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Ready indicator */}
          <div
            className="flex items-center gap-2 mt-4 transition-all duration-500"
            style={{ opacity: showReady ? 1 : 0, transform: showReady ? 'translateY(0)' : 'translateY(10px)' }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
            <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>Component ready — paste into your project</span>
          </div>
        </div>
      </div>
    </div>
  )
}
