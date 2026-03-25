'use client'

import {
  Layout, PanelTop, Square, FormInput, Lock, CreditCard,
  Sparkles, Paintbrush, PanelBottom, LayoutDashboard, Layers, Table,
  Monitor, Server, ChevronDown, ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const iconMap: Record<string, any> = {
  Layout, PanelTop, Square, FormInput, Lock, CreditCard,
  Sparkles, Paintbrush, PanelBottom, LayoutDashboard, Layers, Table,
}

// Group categories under main headings
const categoryGroups = [
  {
    label: 'UI',
    icon: Monitor,
    slugs: ['landing-pages', 'headers', 'cards', 'forms', 'authentication', 'checkout', 'animations', 'backgrounds', 'footers', 'modals', 'tables'],
  },
  {
    label: 'Dashboards',
    icon: LayoutDashboard,
    slugs: ['dashboards'],
  },
]

interface BrowseSidebarProps {
  categories: { name: string; slug: string; icon: string | null }[]
  activeCategory: string | null
  onCategoryChange: (slug: string | null) => void
}

export function BrowseSidebar({ categories, activeCategory, onCategoryChange }: BrowseSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['UI', 'Dashboards'])

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    )
  }

  return (
    <div className="p-5 space-y-6">
      {/* All button */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`w-full text-left text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
          !activeCategory
            ? 'bg-white/10 text-white'
            : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
        }`}
      >
        All Components
      </button>

      {/* Category groups */}
      {categoryGroups.map((group) => {
        const isExpanded = expandedGroups.includes(group.label)
        const GroupIcon = group.icon
        const groupCategories = categories.filter((c) => group.slugs.includes(c.slug))

        return (
          <div key={group.label}>
            <button
              onClick={() => toggleGroup(group.label)}
              className="flex items-center gap-2 w-full text-left text-xs font-semibold uppercase tracking-wider px-3 py-2 rounded-lg text-[#64748b] hover:text-[#94a3b8] transition-colors"
            >
              <GroupIcon className="h-3.5 w-3.5" />
              <span className="flex-1">{group.label}</span>
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-1 space-y-0.5 ml-2">
                {groupCategories.map((cat) => {
                  const CatIcon = iconMap[cat.icon ?? ''] ?? Square
                  const isActive = activeCategory === cat.slug

                  return (
                    <button
                      key={cat.slug}
                      onClick={() => onCategoryChange(isActive ? null : cat.slug)}
                      className={`flex items-center gap-2.5 w-full text-left text-sm px-3 py-1.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-[#667eea]/15 text-[#667eea] font-medium'
                          : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <CatIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{cat.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
