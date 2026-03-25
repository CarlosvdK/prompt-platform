'use client'

import Link from 'next/link'

export function CtaFooter() {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20">
      {/* Subtle radial background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(102,126,234,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Heading */}
        <h2
          className="gradient-text font-extrabold mb-4"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em' }}
        >
          Start building faster.
        </h2>

        {/* Subtitle */}
        <p className="text-lg mb-10" style={{ color: '#94a3b8' }}>
          Join developers who ship UI 10x faster with zero-shot prompts.
        </p>

        {/* CTA Button */}
        <Link
          href="/browse"
          className="inline-block rounded-xl px-10 py-4 text-base font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
        >
          Browse Components
        </Link>
      </div>
    </section>
  )
}
