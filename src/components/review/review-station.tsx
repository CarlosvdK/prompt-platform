'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Check, X, FlaskConical, Loader2, Brain, ChevronDown, Eye, Sparkles } from 'lucide-react'

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

const STATUS_TABS = [
  { key: 'PENDING_REVIEW', label: 'Pending Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'NEEDS_CHANGES', label: 'Needs Changes' },
  { key: 'PUBLISHED', label: 'Published' },
] as const

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
]

export function ReviewStation() {
  const [activeTab, setActiveTab] = useState('PENDING_REVIEW')
  const [prompts, setPrompts] = useState<QueuePrompt[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null)
  const [learningStats, setLearningStats] = useState<LearningStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Test panel state
  const [testModel, setTestModel] = useState(MODELS[0].id)
  const [testCode, setTestCode] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testError, setTestError] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  const leftPanelRef = useRef<HTMLDivElement>(null)

  const selected = prompts.find((p) => p.id === selectedId) ?? null

  const fetchQueue = useCallback(async (status: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/review/queue-with-previews?status=${status}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setPrompts(data.data)
      setStatusCounts(data.statusCounts)
      setLearningStats(data.learningStats)
      if (data.data.length > 0 && !data.data.find((p: QueuePrompt) => p.id === selectedId)) {
        setSelectedId(data.data[0].id)
      }
    } catch {
      setPrompts([])
    } finally {
      setLoading(false)
    }
  }, [selectedId])

  useEffect(() => {
    fetchQueue(activeTab)
  }, [activeTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (promptId: string, action: 'approve' | 'reject') => {
    setActionLoading(promptId)
    try {
      const endpoint = action === 'approve'
        ? `/api/review/${promptId}/approve`
        : `/api/review/${promptId}/reject`
      const body = action === 'reject' ? { notes: 'Rejected during review station triage' } : {}

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Action failed')
      }

      // Remove from list and select next
      setPrompts((prev) => {
        const idx = prev.findIndex((p) => p.id === promptId)
        const next = prev.filter((p) => p.id !== promptId)
        if (selectedId === promptId) {
          const nextItem = next[Math.min(idx, next.length - 1)]
          setSelectedId(nextItem?.id ?? null)
        }
        return next
      })

      // Update counts
      setStatusCounts((prev) => {
        if (!prev) return prev
        const updated = { ...prev }
        updated[activeTab as keyof StatusCounts] = Math.max(0, updated[activeTab as keyof StatusCounts] - 1)
        if (action === 'approve') updated.APPROVED += 1
        else updated.REJECTED += 1
        return updated
      })

      setLearningStats((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          approvedCount: prev.approvedCount + (action === 'approve' ? 1 : 0),
          rejectedCount: prev.rejectedCount + (action === 'reject' ? 1 : 0),
          totalDecisions: prev.totalDecisions + 1,
        }
      })

      // Clear test results
      setTestCode(null)
      setTestError(null)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const runTest = async () => {
    if (!selected) return
    setTestLoading(true)
    setTestError(null)
    setTestCode(null)

    try {
      const res = await fetch(`/api/prompts/${selected.id}/test`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json()
      setTestCode(data.code)
    } catch (err) {
      setTestError(err instanceof Error ? err.message : 'Test failed')
    } finally {
      setTestLoading(false)
    }
  }

  const isPending = activeTab === 'PENDING_REVIEW'

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Status Tabs */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-white/[0.06] bg-[#0f1117] shrink-0 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = statusCounts?.[tab.key as keyof StatusCounts] ?? 0
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setTestCode(null); setTestError(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}

        {/* Learning Stats */}
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

      {/* Main Split Panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Prompt Stack */}
        <div
          ref={leftPanelRef}
          className="w-[420px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-[#0a0b0f]"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
            </div>
          ) : prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <Sparkles className="h-8 w-8 text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">No prompts in this queue</p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {prompts.map((prompt) => {
                const isSelected = selectedId === prompt.id
                const isActioning = actionLoading === prompt.id
                return (
                  <div
                    key={prompt.id}
                    onClick={() => { setSelectedId(prompt.id); setTestCode(null); setTestError(null); }}
                    className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 bg-[#111318]'
                        : 'bg-[#111318] hover:bg-[#161922] border border-white/[0.04]'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 shrink-0">
                          {prompt.category.name}
                        </span>
                        <span className="text-sm font-medium text-white/80 truncate">{prompt.title}</span>
                      </div>
                      {isPending && (
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(prompt.id, 'approve'); }}
                            disabled={isActioning}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[11px] font-medium transition-colors"
                          >
                            {isActioning && actionLoading === prompt.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(prompt.id, 'reject'); }}
                            disabled={isActioning}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-[11px] font-medium transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    <div className="relative aspect-[16/10] bg-[#09090b] mx-2 mb-2 rounded-lg overflow-hidden">
                      {prompt.previewCode ? (
                        <CardPreviewIframe promptId={prompt.id} />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-600">
                          No preview
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Panel — Test Area */}
        <div className="flex-1 overflow-y-auto bg-[#08090d]">
          {selected ? (
            <div className="p-6 max-w-4xl">
              {/* Selected Prompt Info */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">{selected.title}</h2>
                <p className="text-sm text-slate-400">{selected.description}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                  <span>{selected.category.name}</span>
                  <span>{selected.type}</span>
                  <span>{new Date(selected.createdAt).toLocaleDateString()}</span>
                  <span>{selected.reviewCount} reviews</span>
                </div>
              </div>

              {/* Test Controls */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <select
                    value={testModel}
                    onChange={(e) => setTestModel(e.target.value)}
                    className="appearance-none pl-4 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all cursor-pointer"
                  >
                    {MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
                <button
                  onClick={runTest}
                  disabled={testLoading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {testLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FlaskConical className="h-4 w-4" />
                  )}
                  Test Prompt
                </button>
              </div>

              {/* Side-by-side Comparison */}
              {(testCode || testLoading || testError) && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Original */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-medium text-slate-300">Original Preview</span>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#09090b]">
                      {selected.previewCode ? (
                        <RenderIframe code={selected.previewCode} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-sm text-slate-600">No preview</div>
                      )}
                    </div>
                  </div>

                  {/* Generated */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-xs font-medium text-slate-300">Generated from Prompt</span>
                    </div>
                    <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#09090b]">
                      {testLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <Loader2 className="h-5 w-5 animate-spin text-indigo-400 mx-auto mb-2" />
                            <p className="text-xs text-slate-500">Generating...</p>
                          </div>
                        </div>
                      ) : testError ? (
                        <div className="flex items-center justify-center h-full p-4">
                          <p className="text-xs text-red-400 text-center">{testError}</p>
                        </div>
                      ) : testCode ? (
                        <RenderIframe code={testCode} />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* Prompt Content */}
              <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setShowContent(!showContent)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-slate-500" />
                    Prompt Content
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${showContent ? 'rotate-180' : ''}`} />
                </button>
                {showContent && (
                  <div className="px-4 pb-4 border-t border-white/[0.04]">
                    <pre className="mt-3 text-xs text-slate-400 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                      {selected.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Large Preview */}
              {selected.previewCode && !testCode && !testLoading && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Full Preview</h3>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/[0.06] bg-[#09090b]">
                    <RenderIframe code={selected.previewCode} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Eye className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select a prompt to review</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* --- Helper Components --- */

function CardPreviewIframe({ promptId }: { promptId: string }) {
  return (
    <iframe
      src={`/api/preview/${promptId}/render`}
      loading="lazy"
      className="absolute inset-0 w-full h-full border-0 origin-top-left"
      style={{ pointerEvents: 'none', width: '1280px', height: '800px', transform: 'scale(0.3)' }}
      sandbox="allow-scripts allow-same-origin"
      title="Preview"
    />
  )
}

function RenderIframe({ code }: { code: string }) {
  let sanitized = code.replace(/^import\s[^;]+;?\s*$/gm, '')
  sanitized = sanitized.replace(/export\s+default\s+/g, 'window.__COMPONENT__ = ')
  sanitized = sanitized.replace(/^export\s+(function|const|class)\s+/gm, '$1 ')
  const encoded = typeof window !== 'undefined'
    ? btoa(unescape(encodeURIComponent(sanitized)))
    : ''

  const html = `<!DOCTYPE html>
<html lang="en" class="dark"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<script src="https://cdn.tailwindcss.com"><\/script><script>tailwind.config={darkMode:'class'}<\/script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin><\/script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin><\/script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#09090b;min-height:100vh;font-family:'Inter',system-ui,sans-serif}#root{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center}</style>
</head><body><div id="root"></div><script>
const{useState,useEffect,useRef,useCallback,useMemo,useContext,useReducer,createContext,Fragment,forwardRef}=React;
Object.assign(window,{useState,useEffect,useRef,useCallback,useMemo,useContext,useReducer,createContext,Fragment,forwardRef});
window.require=m=>m==='react'?React:{};
try{const src=atob('${encoded}');const result=Babel.transform(src,{presets:[['react',{}],['typescript',{allExtensions:true,isTSX:true}]],filename:'c.tsx'});(0,eval)(result.code);
if(window.__COMPONENT__){ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.__COMPONENT__));}
else{throw new Error('No default export');}
}catch(err){document.getElementById('root').innerHTML='<div style="color:#ef4444;font-family:monospace;padding:2rem;font-size:13px;white-space:pre-wrap">'+err.message+'<\\/div>';}<\/script></body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  return (
    <iframe
      src={url}
      className="absolute inset-0 w-full h-full border-0"
      sandbox="allow-scripts"
      title="Component Preview"
    />
  )
}
