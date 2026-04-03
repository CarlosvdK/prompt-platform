import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const prompt = await db.prompt.findUnique({
    where: { id },
    select: {
      metadata: true,
      title: true,
      previews: {
        where: { type: 'code_snippet' },
        orderBy: { sortOrder: 'asc' },
        take: 1,
        select: { content: true },
      },
    },
  })

  if (!prompt) {
    return new NextResponse('Not found', { status: 404 })
  }

  const metadata = prompt.metadata as Record<string, any> | null
  const previewCode = metadata?.previewCode ?? prompt.previews[0]?.content ?? null

  if (!previewCode) {
    return new NextResponse(generatePlaceholderHTML(prompt.title), {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const html = generatePreviewHTML(previewCode)

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function sanitizeComponentCode(code: string): string {
  // Strip import statements — all deps are provided as globals
  let out = code.replace(/^import\s[^;]+;?\s*$/gm, '')
  // Replace "export default" with window assignment
  out = out.replace(/export\s+default\s+/g, 'window.__COMPONENT__ = ')
  // Strip named exports so they become plain declarations
  out = out.replace(/^export\s+(function|const|class)\s+/gm, '$1 ')
  return out.trim()
}

function generatePreviewHTML(componentCode: string): string {
  const sanitized = sanitizeComponentCode(componentCode)
  // Base64-encode so backticks, </script>, quotes etc. can't break the HTML
  const encoded = Buffer.from(sanitized).toString('base64')

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config = { darkMode: 'class' }</script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#09090b;min-height:100vh;font-family:'Inter',system-ui,sans-serif}
    #root{opacity:0;transition:opacity 0.3s ease;width:100%;min-height:100vh;display:flex;align-items:center;justify-content:center}
    #root.loaded{opacity:1}
    #loading{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#09090b;z-index:50;transition:opacity 0.3s}
    #loading.hidden{opacity:0;pointer-events:none}
    .spinner{width:24px;height:24px;border:2px solid rgba(102,126,234,0.2);border-top-color:#667eea;border-radius:50%;animation:spin 0.6s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div></div>
  <div id="root"></div>
  <script>
    // Globals: React hooks + lucide-react stub
    const { useState,useEffect,useRef,useCallback,useMemo,useContext,
            useReducer,createContext,Fragment,forwardRef } = React;
    Object.assign(window,{useState,useEffect,useRef,useCallback,useMemo,
      useContext,useReducer,createContext,Fragment,forwardRef});

    const lucideProxy = new Proxy({},{
      get:(_,prop)=>{
        if(prop==='__esModule') return true;
        return ({size,className,...rest}={})=>React.createElement('svg',{
          xmlns:'http://www.w3.org/2000/svg',width:size||24,height:size||24,
          viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',
          strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',
          className:className||'',...rest
        },React.createElement('circle',{cx:12,cy:12,r:10}));
      }
    });
    window.require = m => m==='react'?React:m==='lucide-react'?lucideProxy:{};

    // Block navigation while keeping visual interactions
    document.addEventListener('click', function(e) {
      var el = e.target;
      while (el && el !== document) {
        if (el.tagName === 'A' && el.getAttribute('href')) {
          e.preventDefault();
          return;
        }
        el = el.parentElement;
      }
    }, true);
    document.addEventListener('submit', function(e) { e.preventDefault(); }, true);
    window.addEventListener('beforeunload', function(e) { e.preventDefault(); });

    window.addEventListener('load', function() {
      try {
        const src = atob('${encoded}');
        const result = Babel.transform(src, {
          presets: [
            ['react',{}],
            ['typescript',{allExtensions:true,isTSX:true}]
          ],
          filename:'component.tsx'
        });
        // Run in global scope
        (0,eval)(result.code);

        if (window.__COMPONENT__) {
          ReactDOM.createRoot(document.getElementById('root'))
            .render(React.createElement(window.__COMPONENT__));
          setTimeout(()=>{
            document.getElementById('root').classList.add('loaded');
            document.getElementById('loading').classList.add('hidden');
          },150);
        } else {
          throw new Error('No default export found');
        }
      } catch(err) {
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('root').innerHTML =
          '<div style="color:#ef4444;font-family:monospace;padding:2rem;font-size:14px;white-space:pre-wrap">Error: '+err.message+'</div>';
        document.getElementById('root').classList.add('loaded');
      }
    });
  </script>
</body>
</html>`
}

function generatePlaceholderHTML(title: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      background: #09090b;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: system-ui, sans-serif;
      color: #64748b;
    }
    .placeholder {
      text-align: center;
      padding: 2rem;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .subtitle {
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="placeholder">
    <div class="title">${title}</div>
    <div class="subtitle">Preview not available</div>
  </div>
</body>
</html>`
}
