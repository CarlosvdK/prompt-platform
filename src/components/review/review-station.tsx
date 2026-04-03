'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Check, X, Loader2, Brain, Sparkles, Zap, Bot,
  Copy, Bookmark, RotateCcw, ExternalLink, ChevronLeft, ChevronRight,
} from 'lucide-react'

interface QueuePrompt {
  id: string
  title: string
  slug: string
  type: string
  status: string
  description: string
  content: string
  category: { id: string; name: string; slug: string }
  previewCode: string | null
  createdAt: string
  reviewCount: number
}

interface StatusCounts {
  PENDING_REVIEW: number
  APPROVED: number
  REJECTED: number
  NEEDS_CHANGES: number
  PUBLISHED: number
}

interface LearningStats {
  approvedCount: number
  rejectedCount: number
  publishedCount: number
  totalDecisions: number
}

interface AgentConfig {
  id: string
  name: string
  description: string
  categorySlug: string
  exampleTopics: string[]
}

const STATUS_TABS = [
  { key: 'PENDING_REVIEW', label: 'Pending Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'PUBLISHED', label: 'Published' },
] as const

export function ReviewStation() {
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW')
  const [prompts, setPrompts] = useState<QueuePrompt[]>([])
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null)
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Generate state
  const [agents, setAgents] = useState<AgentConfig[]>([])
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set())
  const [generating, setGenerating] = useState(false)
  const [genMessage, setGenMessage] = useState<string | null>(null)
  const [showGenerate, setShowGenerate] = useState(false)

  // Expanded preview state
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const expandedPrompt = prompts.find((p) => p.id === expandedId) ?? null

  // Fetch queue
  const fetchQueue = useCallback(async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/review/queue-with-previews?status=${status}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPrompts(data.data)
      setStatusCounts(data.statusCounts)
      setLearningStats(data.learningStats)
    } catch {
      setPrompts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchQueue(activeTab) }, [activeTab]) // eslint-disable-line

  // Fetch agent configs
  useEffect(() => {
    fetch('/api/agent/batch').then((r) => r.json()).then(setAgents).catch(() => {})
  }, [])

  // Actions
  const handleAction = async (promptId: string, action: 'approve' | 'reject') => {
    setActionLoading(promptId)
    try {
      const endpoint = action === 'approve'
        ? `/api/review/${promptId}/approve`
        : `/api/review/${promptId}/reject`
      const body = action === 'reject' ? { notes: 'Rejected during review triage' } : {}
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Action failed')

      setPrompts((prev) => prev.filter((p) => p.id !== promptId))
      if (expandedId === promptId) setExpandedId(null)
      setStatusCounts((prev) => {
        if (!prev) return prev
        const updated = { ...prev }
        updated[activeTab as keyof StatusCounts] = Math.max(0, updated[activeTab as keyof StatusCounts] - 1)
        if (action === 'approve') updated.APPROVED += 1
        else updated.REJECTED += 1
        return updated
      })
      setLearningStats((prev) => prev ? {
        ...prev,
        approvedCount: prev.approvedCount + (action === 'approve' ? 1 : 0),
        rejectedCount: prev.rejectedCount + (action === 'reject' ? 1 : 0),
        totalDecisions: prev.totalDecisions + 1,
      } : prev)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  // Generate
  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const generate = async () => {
    setGenerating(true)
    setGenMessage(null)
    try {
      const res = await fetch('/api/agent/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentIds: Array.from(selectedAgents) }),
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setGenMessage(`${data.runs.length} agents started. Prompts will appear in the queue once ready.`)
      setShowGenerate(false)
      // Poll for new results after a delay
      setTimeout(() => fetchQueue(activeTab), 15000)
      setTimeout(() => fetchQueue(activeTab), 30000)
      setTimeout(() => fetchQueue(activeTab), 60000)
    } catch (err) {
      setGenMessage('Generation failed. Check your Anthropic API key.')
    } finally {
      setGenerating(false)
    }
  }

  // Copy helper
  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Navigation in expanded view
  const currentIdx = expandedId ? prompts.findIndex((p) => p.id === expandedId) : -1
  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < prompts.length - 1
  const goPrev = () => { if (hasPrev) setExpandedId(prompts[currentIdx - 1].id) }
  const goNext = () => { if (hasNext) setExpandedId(prompts[currentIdx + 1].id) }

  const isPending = activeTab === 'PENDING_REVIEW'

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top bar: tabs + generate + stats */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#0f1117] shrink-0 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = statusCounts?.[tab.key as keyof StatusCounts] ?? 0
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpandedId(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20' : 'bg-white/10'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}

        <div className="w-px h-5 bg-white/[0.08] mx-1" />

        {/* Generate button */}
        <button
          onClick={() => setShowGenerate(!showGenerate)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            showGenerate ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          Generate
        </button>

        {genMessage && (
          <span className="text-xs text-slate-400 ml-2 whitespace-nowrap">{genMessage}</span>
        )}

        {/* Learning stats */}
        {learningStats && (
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5 text-indigo-400" />
              <span>{learningStats.totalDecisions} decisions</span>
            </div>
            <span className="text-emerald-400">{learningStats.approvedCount} approved</span>
            <span className="text-red-400">{learningStats.rejectedCount} rejected</span>
          </div>
        )}
      </div>

      {/* Generate panel (collapsible) */}
      {showGenerate && (
        <div className="px-4 py-4 border-b border-white/[0.06] bg-[#0b0c10]">
          <div className="flex flex-wrap gap-2 mb-3">
            {agents.map((agent) => {
              const sel = selectedAgents.has(agent.id)
              return (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sel ? 'bg-indigo-600 text-white' : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <Bot className="h-3 w-3" />
                  {agent.name}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedAgents(selectedAgents.size === agents.length ? new Set() : new Set(agents.map((a) => a.id)))}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/[0.06] hover:bg-white/5 transition-colors"
            >
              {selectedAgents.size === agents.length ? 'Deselect All' : 'Select All'}
            </button>
            <button
              onClick={generate}
              disabled={generating || selectedAgents.size === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
              Generate ({selectedAgents.size})
            </button>
          </div>
        </div>
      )}

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#08090d]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Sparkles className="h-8 w-8 text-slate-600 mb-3" />
            <p className="text-sm text-slate-400 mb-1">No prompts in this queue</p>
            <p className="text-xs text-slate-600">Use Generate to create new components</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {prompts.map((prompt) => (
              <div key={prompt.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#111318] transition-all duration-300 ease-out hover:z-10 hover:scale-[1.02]">
                {/* Preview area — clickable */}
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-[#09090b] cursor-pointer"
                  onClick={() => setExpandedId(prompt.id)}
                >
                  {prompt.previewCode ? (
                    <iframe
                      src={`/api/preview/${prompt.id}/render`}
                      loading="lazy"
                      className="absolute left-0 top-0 origin-top-left border-0"
                      style={{ width: '1280px', height: '900px', transform: 'scale(0.22)', pointerEvents: 'none' }}
                      sandbox="allow-scripts allow-same-origin"
                      title="Preview"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-white/[0.06]">{prompt.category.name.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-3 py-2 border-t border-white/[0.04]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 shrink-0">
                      {prompt.category.name}
                    </span>
                    <span className="text-xs font-medium text-white/70 truncate">{prompt.title}</span>
                  </div>
                  {isPending && (
                    <div className="flex items-center gap-1 shrink-0 ml-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(prompt.id, 'approve') }}
                        disabled={actionLoading === prompt.id}
                        className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAction(prompt.id, 'reject') }}
                        disabled={actionLoading === prompt.id}
                        className="p-1.5 rounded-md bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded preview overlay */}
      {expandedPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 lg:p-14"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setExpandedId(null) }}
        >
          {hasPrev && (
            <button onClick={goPrev} className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 bg-black/50 hover:bg-black/70 border border-white/10 transition-all hover:scale-110">
              <ChevronLeft className="h-5 w-5 text-white/70" />
            </button>
          )}
          {hasNext && (
            <button onClick={goNext} className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 z-10 rounded-full p-2.5 bg-black/50 hover:bg-black/70 border border-white/10 transition-all hover:scale-110">
              <ChevronRight className="h-5 w-5 text-white/70" />
            </button>
          )}

          <div className="relative w-full max-w-6xl h-full max-h-[85vh] rounded-2xl overflow-hidden flex flex-col border border-white/[0.08] shadow-2xl shadow-black/50 bg-[#0f1117]">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2.5 shrink-0 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-indigo-500/15 text-indigo-400 shrink-0">
                  {expandedPrompt.category.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-white/90 truncate">{expandedPrompt.title}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
                </button>
                {expandedPrompt.previewCode && (
                  <button
                    onClick={() => copyText(expandedPrompt.previewCode!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy code'}
                  </button>
                )}
                <button
                  onClick={() => copyText(expandedPrompt.content)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy prompt
                </button>
                {isPending && (
                  <>
                    <div className="w-px h-5 bg-white/[0.08] mx-1" />
                    <button
                      onClick={() => { handleAction(expandedPrompt.id, 'approve'); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => { handleAction(expandedPrompt.id, 'reject'); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                )}
                <button onClick={() => setExpandedId(null)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors ml-1">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Interactive preview */}
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">
              {expandedPrompt.previewCode ? (
                <iframe
                  src={`/api/preview/${expandedPrompt.id}/render`}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  title={expandedPrompt.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-slate-500">No preview available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
