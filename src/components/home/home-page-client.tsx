'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { HeroSection } from '@/components/landing/hero-section'
import { PromptGrid } from '@/components/prompts/prompt-grid'
import { BrowseSidebar } from '@/components/home/browse-sidebar'
import { PromptModalProvider } from '@/components/prompts/prompt-modal-provider'
import type { PromptSummary } from '@/types/prompt'

interface HomePageClientProps {
  prompts: PromptSummary[]
  categories: any[]
  tags: any[]
}

export function HomePageClient({ prompts, categories, tags }: HomePageClientProps) {
  const heroEndRef = useRef<HTMLDivElement>(null)
  const [pastHero, setPastHero] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Detect when user scrolls past hero
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (heroEndRef.current) observer.observe(heroEndRef.current)
    return () => observer.disconnect()
  }, [])

  // Filter prompts by active category
  const filteredPrompts = activeCategory
    ? prompts.filter((p) => p.category.slug === activeCategory)
    : prompts

  return (
    <PromptModalProvider prompts={filteredPrompts}>
      <div className="min-h-screen" style={{ background: '#08090d' }}>
        {/* Fixed top bar - appears after scrolling past hero */}
        <header
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            pastHero
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-full pointer-events-none'
          }`}
          style={{
            background: 'rgba(8,9,13,0.92)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <span className="text-lg font-bold gradient-text">Softset</span>
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <HeroSection />
        <div ref={heroEndRef} />

        {/* Browse Section */}
        <div id="browse" className="flex">
          {/* Sidebar - sticky after hero */}
          <aside
            className={`hidden lg:block w-64 shrink-0 transition-opacity duration-300 ${
              pastHero ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              position: 'sticky',
              top: '64px',
              height: 'calc(100vh - 64px)',
              overflowY: 'auto',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <BrowseSidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </aside>

          {/* Grid */}
          <main className="flex-1 p-6">
            <PromptGrid prompts={filteredPrompts} />
          </main>
        </div>
      </div>
    </PromptModalProvider>
  )
}
