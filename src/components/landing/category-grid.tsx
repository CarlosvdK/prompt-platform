'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Layout,
  PanelTop,
  Square,
  FormInput,
  Lock,
  CreditCard,
  Sparkles,
  Paintbrush,
  PanelBottom,
  LayoutDashboard,
  Layers,
  Table,
  Component,
} from 'lucide-react'

function useInView(threshold = 0.1): [React.RefObject<HTMLDivElement | null>, boolean] {
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

const iconMap: Record<string, any> = {
  Layout,
  PanelTop,
  Square,
  FormInput,
  Lock,
  CreditCard,
  Sparkles,
  Paintbrush,
  PanelBottom,
  LayoutDashboard,
  Layers,
  Table,
}

interface Category {
  name: string
  slug: string
  description: string | null
  icon: string | null
  _count: { prompts: number }
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const [ref, isVisible] = useInView()

  if (!categories || categories.length === 0) return null

  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-16">
          <h2
            className="font-extrabold mb-4"
            style={{
              fontSize: 'clamp(32px, 4vw, 56px)',
              letterSpacing: '-0.03em',
              color: '#f1f5f9',
            }}
          >
            Everything you need to build
          </h2>
          <p className="text-lg" style={{ color: '#94a3b8' }}>
            Production-ready prompts across {categories.length} categories
          </p>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category, i) => {
            const IconComponent = iconMap[category.icon || ''] || Component
            const row = Math.floor(i / 3)
            const delay = row * 0.1 + (i % 3) * 0.05

            return (
              <Link
                key={category.slug}
                href={`/browse?category=${category.slug}`}
                className={`glass-card rounded-2xl p-6 block ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{ animationDelay: `${delay}s` }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(102,126,234,0.1)',
                    border: '1px solid rgba(102,126,234,0.2)',
                  }}
                >
                  <IconComponent size={20} style={{ color: '#667eea' }} />
                </div>

                {/* Name */}
                <h3 className="font-semibold mb-1.5" style={{ color: '#f1f5f9' }}>
                  {category.name}
                </h3>

                {/* Description */}
                {category.description && (
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#94a3b8' }}>
                    {category.description}
                  </p>
                )}

                {/* Count badge */}
                <span
                  className="inline-block text-xs rounded-full px-3 py-1"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: '#64748b',
                  }}
                >
                  {category._count.prompts} prompt{category._count.prompts !== 1 ? 's' : ''}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
