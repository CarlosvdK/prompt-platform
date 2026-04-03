'use client'

import { useState } from 'react'
import { FlaskConical, Loader2, RotateCcw } from 'lucide-react'

interface PromptTesterProps {
  promptId: string
  /** The original previewCode from metadata */
  originalCode: string | null
}

export function PromptTester({ promptId, originalCode }: PromptTesterProps) {
  const [testCode, setTestCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usage, setUsage] = useState<{ promptTokens: number; completionTokens: number } | null>(null)

  const runTest = async () => {
    setLoading(true)
    setError(null)
    setTestCode(null)
    setUsage(null)

    try {
      const res = await fetch(`/api/prompts/${promptId}/test`, { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json()
      setTestCode(data.code)
      setUsage(data.usage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test failed')
    } finally {
      setLoading(false)
    }
  }

  if (!testCode && !loading) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
        <FlaskConical className="h-8 w-8 text-slate-500 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">Test Prompt Reproduction</h3>
        <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
          Send the prompt text to Claude and compare the generated output against the original preview
        </p>
        <button
          onClick={runTest}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          <FlaskConical className="h-4 w-4" />
          Run Test
        </button>
        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold">Reproduction Test</h3>
          {usage && (
            <span className="text-[10px] text-slate-500">
              {usage.promptTokens + usage.completionTokens} tokens
            </span>
          )}
        </div>
        <button
          onClick={runTest}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
          Re-test
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Generating from prompt...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      ) : (
        /* Side-by-side comparison */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-300">Original Preview</span>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#09090b]">
              {originalCode ? (
                <RenderIframe code={originalCode} />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-500">
                  No original preview available
                </div>
              )}
            </div>
          </div>

          {/* Test result */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="text-xs font-medium text-slate-300">Generated from Prompt</span>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 bg-[#09090b]">
              {testCode ? (
                <RenderIframe code={testCode} />
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-slate-500">
                  No output generated
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated code expandable */}
      {testCode && (
        <details className="mt-4">
          <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
            View generated code
          </summary>
          <pre className="mt-2 rounded-lg border border-white/10 bg-black/30 p-4 text-xs overflow-x-auto max-h-64 whitespace-pre-wrap text-slate-300">
            {testCode}
          </pre>
        </details>
      )}
    </div>
  )
}

function RenderIframe({ code }: { code: string }) {
  const html = buildPreviewHTML(code)
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

function buildPreviewHTML(code: string): string {
  let sanitized = code.replace(/^import\s[^;]+;?\s*$/gm, '')
  sanitized = sanitized.replace(/export\s+default\s+/g, 'window.__COMPONENT__ = ')
  sanitized = sanitized.replace(/^export\s+(function|const|class)\s+/gm, '$1 ')

  const encoded = btoa(unescape(encodeURIComponent(sanitized)))

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script>tailwind.config = { darkMode: 'class' }<\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#09090b;min-height:100vh;font-family:'Inter',system-ui,sans-serif}#root{width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    const{useState,useEffect,useRef,useCallback,useMemo,useContext,useReducer,createContext,Fragment,forwardRef}=React;
    Object.assign(window,{useState,useEffect,useRef,useCallback,useMemo,useContext,useReducer,createContext,Fragment,forwardRef});
    window.require=m=>m==='react'?React:{};
    try{
      const src=atob('${encoded}');
      const result=Babel.transform(src,{presets:[['react',{}],['typescript',{allExtensions:true,isTSX:true}]],filename:'component.tsx'});
      (0,eval)(result.code);
      if(window.__COMPONENT__){ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.__COMPONENT__));}
      else{throw new Error('No default export found');}
    }catch(err){document.getElementById('root').innerHTML='<div style="color:#ef4444;font-family:monospace;padding:2rem;font-size:14px;white-space:pre-wrap">Error: '+err.message+'<\\/div>';}
  <\/script>
</body>
</html>`
}
