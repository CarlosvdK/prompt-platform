'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { DemoAnimation } from './demo-animation'

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(102,126,234,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(118,75,162,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Sign In button - top right */}
      <div className="absolute top-6 right-6 md:right-12 lg:right-20 z-10">
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <User className="h-4 w-4" />
          Sign In
        </Link>
      </div>

      {/* Logo - top left */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 py-6">
        <Link href="/" className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
          <span className="gradient-text">Softset</span>
        </Link>
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 lg:px-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full max-w-7xl mx-auto items-center">
          {/* Left side */}
          <div className={isVisible ? 'animate-fade-up' : 'opacity-0'}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm mb-8"
              style={{
                background: 'rgba(102,126,234,0.1)',
                border: '1px solid rgba(102,126,234,0.3)',
                color: '#c4b5fd',
              }}
            >
              <span>✨</span>
              <span>Zero-shot UI components</span>
            </div>

            {/* Heading */}
            <h1
              className="font-extrabold leading-[1.05] mb-6"
              style={{
                fontSize: 'clamp(48px, 6vw, 80px)',
                letterSpacing: '-0.04em',
                color: '#f1f5f9',
              }}
            >
              Copy a prompt.
              <br />
              <span className="gradient-text">Ship a UI.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
              style={{ color: '#94a3b8' }}
            >
              Browse production-ready component prompts. Copy, paste into any LLM, and get
              identical React + Tailwind code every time. No iterations. No wasted tokens.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <a
                href="#browse"
                className="rounded-full px-8 py-3.5 text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                }}
              >
                Browse Components
              </a>
              <a
                href="#how-it-works"
                className="rounded-full px-8 py-3.5 text-base font-semibold transition-all hover:bg-white/5"
                style={{
                  color: '#f1f5f9',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                How It Works ↓
              </a>
            </div>

            {/* Stats */}
            <p className="text-sm" style={{ color: '#64748b' }}>
              120+ Components&nbsp;&nbsp;•&nbsp;&nbsp;Works with any LLM&nbsp;&nbsp;•&nbsp;&nbsp;Zero-shot accuracy
            </p>
          </div>

          {/* Right side */}
          <div
            className={`${isVisible ? 'animate-fade-up' : 'opacity-0'} animate-float hidden lg:block`}
            style={{ animationDelay: '0.2s' }}
          >
            <DemoAnimation />
          </div>
        </div>
      </div>
    </section>
  )
}
