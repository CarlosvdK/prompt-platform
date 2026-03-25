import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const prompt = await db.prompt.findUnique({
    where: { id },
    select: { metadata: true, title: true },
  })

  if (!prompt) {
    return new NextResponse('Not found', { status: 404 })
  }

  const metadata = prompt.metadata as Record<string, any> | null
  const previewCode = metadata?.previewCode

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

function generatePreviewHTML(componentCode: string): string {
  // Escape the code for embedding in a script tag
  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
          },
        },
      },
    }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', system-ui, sans-serif;
      overflow: hidden;
    }
    #root {
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    /* Smooth loading */
    #root { opacity: 0; transition: opacity 0.3s ease; }
    #root.loaded { opacity: 1; }

    #loading {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #09090b;
      z-index: 50;
      transition: opacity 0.3s ease;
    }
    #loading.hidden { opacity: 0; pointer-events: none; }
    .spinner {
      width: 24px;
      height: 24px;
      border: 2px solid rgba(102,126,234,0.2);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div></div>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    // Provide lucide-react stub for icons
    const lucideIcons = new Proxy({}, {
      get: (target, prop) => {
        if (prop === '__esModule') return true;
        // Return a simple SVG icon placeholder
        return function Icon(props) {
          return React.createElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: props?.size || 24,
            height: props?.size || 24,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: props?.className || '',
            ...props,
          }, React.createElement('circle', { cx: 12, cy: 12, r: 10 }));
        };
      }
    });

    // Make lucide-react available as a module
    window.require = function(mod) {
      if (mod === 'lucide-react') return lucideIcons;
      if (mod === 'react') return React;
      return {};
    };

    try {
      ${componentCode.replace(/export\s+default\s+/g, 'window.__COMPONENT__ = ')}

      // Also try to capture named exports
      if (!window.__COMPONENT__) {
        // Look for function declarations
        const match = ${JSON.stringify(componentCode)}.match(/(?:function|const)\\s+(\\w+)/g);
        if (match) {
          const lastName = match[match.length - 1].replace(/(?:function|const)\\s+/, '');
          if (typeof window[lastName] === 'function') {
            window.__COMPONENT__ = window[lastName];
          }
        }
      }

      if (window.__COMPONENT__) {
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(window.__COMPONENT__));
        setTimeout(() => {
          document.getElementById('root').classList.add('loaded');
          document.getElementById('loading').classList.add('hidden');
        }, 100);
      } else {
        throw new Error('No component found');
      }
    } catch (err) {
      document.getElementById('loading').classList.add('hidden');
      document.getElementById('root').innerHTML = '<div style="color:#ef4444;font-family:monospace;padding:2rem;font-size:14px;">Error rendering component: ' + err.message + '</div>';
      document.getElementById('root').classList.add('loaded');
    }
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
