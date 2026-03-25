'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Copy, Code } from 'lucide-react'

function useInView(threshold = 0.15): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const steps = [
  {
    number: '1',
    title: 'Find',
    description:
      'Browse hundreds of UI components. Filter by category, see live previews, find exactly what you need.',
    Icon: Search,
  },
  {
    number: '2',
    title: 'Copy',
    description:
      'One click copies the full prompt. Optimized for zero-shot accuracy across all major LLMs.',
    Icon: Copy,
  },
  {
    number: '3',
    title: 'Build',
    description:
      'Paste into ChatGPT, Claude, or Gemini. Get production-ready React + Tailwind code instantly.',
    Icon: Code,
  },
]

export function HowItWorks() {
  const [ref, isVisible] = useInView()

  return (
    <section id="how-it-works" className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2
            className="gradient-text font-extrabold mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em' }}
          >
            How it works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
            Three steps to production-ready components
          </p>
        </div>

        {/* Cards */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`glass-card rounded-2xl p-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              {/* Number circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-6"
                style={{
                  background: 'rgba(102,126,234,0.1)',
                  border: '1px solid rgba(102,126,234,0.3)',
                  color: '#c4b5fd',
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div className="mb-4">
                <step.Icon
                  size={24}
                  style={{ color: '#667eea' }}
                />
              </div>

              {/* Title */}
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: '#f1f5f9' }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
