'use client'

import { useEffect, useRef, useState } from 'react'
import { Zap, Gauge, Globe, Rocket } from 'lucide-react'

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

const props = [
  {
    Icon: Zap,
    title: 'Zero-Shot Ready',
    description:
      'Every prompt produces identical output on the first try. No iterations, no prompt engineering required.',
  },
  {
    Icon: Gauge,
    title: 'Token Efficient',
    description:
      'Optimized prompts with exact Tailwind classes and structure. No wasted tokens on vague descriptions.',
  },
  {
    Icon: Globe,
    title: 'Any LLM',
    description:
      'Works with ChatGPT, Claude, Gemini, Llama, and any code-capable model. Same prompt, same result.',
  },
  {
    Icon: Rocket,
    title: 'Production Code',
    description:
      'Every component is self-contained React + Tailwind. Copy, paste, ship. Connect to your backend in minutes.',
  },
]

export function ValueProps() {
  const [ref, isVisible] = useInView()

  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="gradient-text font-extrabold mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.03em' }}
          >
            Why Softset?
          </h2>
          <p className="text-lg" style={{ color: '#94a3b8' }}>
            Built for developers who ship fast
          </p>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {props.map((prop, i) => (
            <div
              key={prop.title}
              className={`glass-card rounded-2xl p-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(102,126,234,0.1)' }}
              >
                <prop.Icon size={22} style={{ color: '#667eea' }} />
              </div>

              {/* Title */}
              <h3
                className="text-xl font-semibold mt-4 mb-3"
                style={{ color: '#f1f5f9' }}
              >
                {prop.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
