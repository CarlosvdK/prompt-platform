'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Search, User, Brain } from 'lucide-react'
import { HeroDemo } from '@/components/home/hero-demo'
import { PromptCard } from '@/components/prompts/prompt-card'
import { PromptModalProvider } from '@/components/prompts/prompt-modal-provider'
import type { PromptSummary } from '@/types/prompt'

interface HomePageProps {
  prompts: PromptSummary[]
  categories: { id: string; name: string; slug: string }[]
}

export function HomePage({ prompts, categories }: HomePageProps) {
  const heroEndRef = useRef<HTMLDivElement>(null)
  const featuredRef = useRef<HTMLDivElement>(null)
  const [pastHero, setPastHero] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [activeColor, setActiveColor] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Detect when user scrolls past hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroEndRef.current) observer.observe(heroEndRef.current)
    return () => observer.disconnect()
  }, [])

  // Scroll-triggered card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'))
            if (!isNaN(index)) {
              setVisibleCards((prev) => new Set(prev).add(index))
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    const cards = featuredRef.current?.querySelectorAll('[data-index]')
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [prompts, activeFilter, debouncedSearch])

  // Filter prompts
  const filteredPrompts = useMemo(() => {
    let result = prompts
    if (activeFilter) {
      result = result.filter((p) => p.category.slug === activeFilter)
    }
    if (activeColor) {
      result = result.filter((p) => {
        const meta = p.metadata as Record<string, any> | null
        return meta?.colorPalette === activeColor
      })
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q))
    }
    return result
  }, [prompts, activeFilter, activeColor, debouncedSearch])

  // Get available color palettes from prompts
  const availableColors = useMemo(() => {
    const colorMap: Record<string, { id: string; preview: string; name: string }> = {
      ocean: { id: 'ocean', preview: '#06b6d4', name: 'Ocean' },
      sunset: { id: 'sunset', preview: '#f97316', name: 'Sunset' },
      forest: { id: 'forest', preview: '#10b981', name: 'Forest' },
      lavender: { id: 'lavender', preview: '#8b5cf6', name: 'Lavender' },
      crimson: { id: 'crimson', preview: '#f43f5e', name: 'Crimson' },
      amber: { id: 'amber', preview: '#f59e0b', name: 'Amber' },
      sapphire: { id: 'sapphire', preview: '#3b82f6', name: 'Sapphire' },
      pink: { id: 'pink', preview: '#ec4899', name: 'Pink' },
      lime: { id: 'lime', preview: '#84cc16', name: 'Lime' },
      slate: { id: 'slate', preview: '#64748b', name: 'Slate' },
      coral: { id: 'coral', preview: '#ef4444', name: 'Coral' },
      sky: { id: 'sky', preview: '#0ea5e9', name: 'Sky' },
    }
    const found = new Set<string>()
    prompts.forEach((p) => {
      const meta = p.metadata as Record<string, any> | null
      if (meta?.colorPalette && colorMap[meta.colorPalette]) {
        found.add(meta.colorPalette)
      }
    })
    return Array.from(found).map((id) => colorMap[id]).filter(Boolean)
  }, [prompts])

  const scrollToBrowse = useCallback(() => {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <PromptModalProvider prompts={filteredPrompts}>
      <div className="min-h-screen" style={{ background: '#08090d' }}>
        {/* ───── FIXED TOP HEADER ───── */}
        <header
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
          style={{
            background: pastHero ? 'rgba(8,9,13,0.95)' : 'transparent',
            backdropFilter: pastHero ? 'blur(24px)' : 'none',
            borderBottom: pastHero ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between px-4 md:px-8 py-3">
            {/* Logo */}
            <Link href="/" className="text-lg font-bold shrink-0">
              <span className="gradient-text">Softset</span>
            </Link>

            {/* Search bar */}
            <div className="hidden sm:flex items-center flex-1 max-w-xl mx-8">
              <div
                className="flex items-center gap-2.5 w-full rounded-full px-5 py-2.5 transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: '#64748b' }} />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#4a5568]"
                  style={{ color: '#e2e8f0' }}
                />
              </div>
            </div>

            {/* Sign In */}
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5 shrink-0"
              style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Sign In</span>
            </Link>
          </div>

          {/* Category filter pills */}
          <div
            className="flex items-center gap-2.5 px-4 md:px-8 py-3 overflow-x-auto hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {/* All pill */}
            <button
              onClick={() => setActiveFilter(null)}
              className="shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
              style={
                !activeFilter
                  ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                    }
                  : {
                      background: 'rgba(255,255,255,0.05)',
                      color: '#94a3b8',
                    }
              }
              onMouseEnter={(e) => {
                if (activeFilter) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              }}
              onMouseLeave={(e) => {
                if (activeFilter) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              }}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(activeFilter === cat.slug ? null : cat.slug)}
                className="shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
                style={
                  activeFilter === cat.slug
                    ? {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        color: '#94a3b8',
                      }
                }
                onMouseEnter={(e) => {
                  if (activeFilter !== cat.slug) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  if (activeFilter !== cat.slug) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              >
                {cat.name}
              </button>
            ))}

            {/* Color filter */}
            {availableColors.length > 0 && (
              <>
                <span
                  className="shrink-0 w-px h-5 self-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                />
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setActiveColor(activeColor === color.id ? null : color.id)}
                    title={color.name}
                    className={`shrink-0 w-7 h-7 rounded-full transition-all duration-200 ${
                      activeColor === color.id
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#08090d] scale-110'
                        : 'hover:scale-110 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.preview }}
                  />
                ))}
              </>
            )}

            {/* Divider */}
            <span
              className="shrink-0 w-px h-5 self-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            />

            {/* Training — admin only */}
            <Link
              href="/admin/training"
              className="shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(102,126,234,0.1)',
                border: '1px solid rgba(102,126,234,0.2)',
                color: '#a5b4fc',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(102,126,234,0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(102,126,234,0.1)'
              }}
            >
              <Brain className="h-3.5 w-3.5" />
              Training
            </Link>
          </div>
        </header>

        {/* ───── HERO SECTION ───── */}
        <section className="relative z-0 min-h-[80vh] flex items-center overflow-hidden pt-28">
          {/* Background blobs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 600px 400px at 20% 50%, rgba(102,126,234,0.08) 0%, transparent 70%), radial-gradient(ellipse 500px 350px at 75% 30%, rgba(118,75,162,0.06) 0%, transparent 70%)',
            }}
          />

          <div className="relative z-10 w-full mx-auto px-6 md:px-10 lg:px-16 xl:px-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
              {/* Left column */}
              <div className="animate-fade-up">
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-sm mb-8"
                  style={{
                    background: 'rgba(102,126,234,0.1)',
                    border: '1px solid rgba(102,126,234,0.25)',
                    color: '#c4b5fd',
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span
                      className="absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{
                        background: '#667eea',
                        animation: 'pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: '#667eea' }}
                    />
                  </span>
                  Zero-shot UI components
                </div>

                {/* Heading */}
                <h1
                  className="font-extrabold leading-[1.05] mb-6"
                  style={{
                    fontSize: 'clamp(40px, 5vw, 72px)',
                    letterSpacing: '-0.04em',
                  }}
                >
                  <span style={{ color: '#f1f5f9' }}>Find it.</span>
                  <br />
                  <span className="gradient-text">Copy it.</span>
                  <br />
                  <span style={{ color: '#f1f5f9' }}>Ship it.</span>
                </h1>

                {/* Subtitle */}
                <p
                  className="text-lg leading-relaxed mb-10 max-w-lg"
                  style={{ color: '#94a3b8' }}
                >
                  Production-ready prompts for React + Tailwind components.
                  Copy, paste into any LLM, get identical code. Every time.
                </p>

                {/* CTA */}
                <button
                  onClick={scrollToBrowse}
                  className="rounded-xl px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    boxShadow: '0 4px 24px rgba(102,126,234,0.25)',
                  }}
                >
                  Start Browsing &rarr;
                </button>

                {/* Stats */}
                <p className="text-xs mt-6" style={{ color: '#64748b' }}>
                  500+ prompts &middot; 12 categories &middot; Works with any LLM
                </p>
              </div>

              {/* Right column — Demo */}
              <div
                className="hidden lg:flex justify-end animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                <HeroDemo />
              </div>
            </div>
          </div>
        </section>

        {/* Sentinel for header background detection */}
        <div ref={heroEndRef} />

        {/* ───── FEATURED SECTION ───── */}
        <section className="relative px-6 md:px-10 lg:px-16 xl:px-24 py-16" ref={featuredRef}>
          <h2
            className="text-lg font-semibold mb-8"
            style={{ color: '#f1f5f9' }}
          >
            Featured
          </h2>

          {filteredPrompts.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm" style={{ color: '#64748b' }}>
                No prompts found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filteredPrompts.map((prompt, i) => (
                <div
                  key={prompt.id}
                  data-index={i}
                  className="transition-all duration-700 ease-out"
                  style={{
                    opacity: visibleCards.has(i) ? 1 : 0,
                    transform: visibleCards.has(i) ? 'translateY(0)' : 'translateY(24px)',
                    transitionDelay: `${(i % 5) * 80}ms`,
                  }}
                >
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mobile search (visible on small screens in hero area) */}
        <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
          <div
            className="flex items-center gap-2 rounded-full px-4 py-3"
            style={{
              background: 'rgba(8,9,13,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-[#4a5568]"
              style={{ color: '#e2e8f0' }}
            />
          </div>
        </div>
      </div>
    </PromptModalProvider>
  )
}
