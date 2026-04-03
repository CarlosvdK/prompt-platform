'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bot, Zap, Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'

interface AgentConfig {
  id: string
  name: string
  description: string
  categorySlug: string
  exampleTopics: string[]
}

interface RunResult {
  id: string
  skill: string
  status?: string
}

export default function GeneratePage() {
  const [agents, setAgents] = useState<AgentConfig[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [runs, setRuns] = useState<RunResult[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/agent/batch')
      .then((r) => r.json())
      .then(setAgents)
      .catch(() => setError('Failed to load agent configs'))
  }, [])

  const toggleAgent = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selected.size === agents.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(agents.map((a) => a.id)))
    }
  }

  const generate = async () => {
    setGenerating(true)
    setError(null)
    setRuns([])

    try {
      const res = await fetch('/api/agent/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentIds: Array.from(selected),
          topic: topic || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json()
      setRuns(data.runs.map((r: RunResult) => ({ ...r, status: 'QUEUED' })))

      // Poll for status updates
      pollRuns(data.runs.map((r: RunResult) => r.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const pollRuns = async (runIds: string[]) => {
    const poll = async () => {
      const results = await Promise.all(
        runIds.map(async (id) => {
          try {
            const res = await fetch(`/api/agent/runs/${id}`)
            if (!res.ok) return null
            return res.json()
          } catch {
            return null
          }
        }),
      )

      const updated = results.filter(Boolean)
      if (updated.length > 0) {
        setRuns((prev) =>
          prev.map((run) => {
            const fresh = updated.find((u: any) => u.id === run.id)
            return fresh ? { ...run, status: fresh.status } : run
          }),
        )
      }

      const allDone = updated.every(
        (u: any) => u?.status === 'COMPLETED' || u?.status === 'FAILED',
      )
      if (!allDone) {
        setTimeout(poll, 2000)
      }
    }

    setTimeout(poll, 3000)
  }

  const statusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-400" />
      case 'RUNNING':
        return <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
      default:
        return <Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
    }
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/agents"
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Generate Components</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Select specialized agents to generate UI component prompts
          </p>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {agents.map((agent) => {
          const isSelected = selected.has(agent.id)
          return (
            <button
              key={agent.id}
              onClick={() => toggleAgent(agent.id)}
              className={`text-left p-5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'border-indigo-500/50 bg-indigo-500/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Bot className={`h-5 w-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                  }`}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="font-semibold text-sm text-white mb-1">{agent.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{agent.description}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
                  {agent.categorySlug}
                </span>
                <span className="text-[10px] text-slate-600">
                  {agent.exampleTopics.length} topics
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Controls */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 mb-8">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Topic (optional)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Leave blank for random topics per agent..."
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <button
            onClick={selectAll}
            className="shrink-0 px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm text-slate-300 hover:bg-white/5 transition-colors"
          >
            {selected.size === agents.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={generate}
            disabled={generating || selected.size === 0}
            className="shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            Generate {selected.size > 0 ? `(${selected.size})` : ''}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 mb-6 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Run Results */}
      {runs.length > 0 && (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <h3 className="font-semibold text-sm">Generation Runs</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {runs.map((run) => (
              <div key={run.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  {statusIcon(run.status)}
                  <span className="text-sm font-medium text-slate-200">{run.skill}</span>
                  <span className="text-xs text-slate-500">{run.status}</span>
                </div>
                {run.status === 'COMPLETED' && (
                  <Link
                    href={`/admin/agents/${run.id}`}
                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View Drafts →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
