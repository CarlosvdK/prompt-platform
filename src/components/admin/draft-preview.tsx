'use client'

import { useState, useEffect } from 'react'

interface DraftData {
  id: string
  title: string
  description: string
  content: string
  metadata: { previewCode?: string } | null
}

export function DraftPreview({ draftId }: { draftId: string }) {
  const [draft, setDraft] = useState<DraftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'preview' | 'prompt'>('preview')

  useEffect(() => {
    fetch(`/api/agent/drafts/${draftId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setDraft(data)
        if (!data?.metadata?.previewCode) setTab('prompt')
      })
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [draftId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500" />
      </div>
    )
  }

  if (!draft) {
    return <p className="text-sm text-muted-foreground">Failed to load draft</p>
  }

  const hasPreview = !!draft.metadata?.previewCode

  return (
    <div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{draft.description}</p>

      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {hasPreview && (
          <button
            onClick={() => setTab('preview')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Live Preview
          </button>
        )}
        <button
          onClick={() => setTab('prompt')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            tab === 'prompt'
              ? 'bg-indigo-600 text-white'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Prompt Content
        </button>
      </div>

      {/* Content */}
      {tab === 'preview' && hasPreview ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-[#09090b]">
          <PreviewIframe code={draft.metadata!.previewCode!} />
        </div>
      ) : (
        <pre className="rounded-lg border border-border bg-muted p-4 text-sm overflow-x-auto max-h-96 whitespace-pre-wrap">
          {draft.content}
        </pre>
      )}
    </div>
  )
}

function PreviewIframe({ code }: { code: string }) {
  const html = generatePreviewHTML(code)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)

  return (
    <iframe
      src={url}
      className="absolute inset-0 w-full h-full border-0"
      sandbox="allow-scripts"
      title="Draft Preview"
    />
  )
}

function generatePreviewHTML(code: string): string {
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
    }catch(err){document.getElementById('root').innerHTML='<div style="color:#ef4444;font-family:monospace;padding:2rem;font-size:14px">Error: '+err.message+'</div>';}
  <\/script>
</body>
</html>`
}
