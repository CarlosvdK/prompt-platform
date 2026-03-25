import { chromium } from '@playwright/test'
import { Prisma, PrismaClient } from '@prisma/client'
import * as fs from 'node:fs'
import * as path from 'node:path'

const db = new PrismaClient()

const HTML_TEMPLATE = (componentCode: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {}
      }
    }
  </script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #09090b; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    #root { width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body class="dark">
  <div id="root"></div>
  <script type="text/babel">
    ${componentCode}

    // Try to find the default export or any component
    const Component = typeof exports !== 'undefined' && exports.default
      ? exports.default
      : typeof App !== 'undefined' ? App
      : null;

    if (Component) {
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Component));
    } else {
      // Try to render the last function declaration
      const lastFunc = ${JSON.stringify(componentCode)}.match(/(?:function|const)\\s+(\\w+)/g);
      if (lastFunc) {
        const name = lastFunc[lastFunc.length - 1].replace(/(?:function|const)\\s+/, '');
        if (typeof window[name] === 'function') {
          ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window[name]));
        }
      }
    }
  </script>
</body>
</html>`

async function renderPrompt(promptId: string) {
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true, title: true, slug: true, metadata: true },
  })

  if (!prompt) {
    console.error(`Prompt ${promptId} not found`)
    return false
  }

  const metadata = prompt.metadata as Record<string, any> | null
  const previewCode = metadata?.previewCode

  if (!previewCode) {
    console.error(`Prompt "${prompt.title}" has no previewCode in metadata`)
    return false
  }

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads', 'previews')
  fs.mkdirSync(uploadsDir, { recursive: true })

  const filename = `${prompt.slug}-${Date.now()}.png`
  const filepath = path.join(uploadsDir, filename)

  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2,
    })

    // Set the HTML content
    const html = HTML_TEMPLATE(previewCode)
    await page.setContent(html, { waitUntil: 'networkidle' })

    // Wait a bit for Tailwind CDN and fonts to load
    await page.waitForTimeout(2000)

    // Take screenshot
    await page.screenshot({
      path: filepath,
      fullPage: false,
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    })

    await browser.close()

    // Create/update PromptPreview record
    const previewUrl = `/uploads/previews/${filename}`

    await db.promptPreview.create({
      data: {
        promptId: prompt.id,
        type: 'screenshot',
        content: previewUrl,
        sortOrder: 0,
      },
    })

    // Update prompt thumbnailUrl
    await db.prompt.update({
      where: { id: prompt.id },
      data: { thumbnailUrl: previewUrl },
    })

    console.log(`  ✓ Screenshot saved: ${filepath}`)
    console.log(`  ✓ Thumbnail URL set: ${previewUrl}`)
    return true
  } catch (err: any) {
    console.error(`  ✗ Render failed: ${err.message}`)
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const promptIdFlag = args.indexOf('--prompt-id')
  const allPendingFlag = args.includes('--all-pending')
  const allPublishedFlag = args.includes('--all-published')

  if (promptIdFlag !== -1) {
    // Render a single prompt
    const promptId = args[promptIdFlag + 1]
    if (!promptId) {
      console.error('Usage: pnpm render:preview -- --prompt-id <id>')
      process.exit(1)
    }
    console.log(`Rendering preview for prompt ${promptId}...`)
    const success = await renderPrompt(promptId)
    process.exit(success ? 0 : 1)
  } else if (allPendingFlag) {
    // Render all prompts in PENDING_REVIEW that don't have a thumbnail
    const prompts = await db.prompt.findMany({
      where: {
        status: 'PENDING_REVIEW',
        thumbnailUrl: null,
        metadata: { not: Prisma.JsonNull },
      },
      select: { id: true, title: true },
    })
    console.log(`Found ${prompts.length} pending prompts without thumbnails\n`)
    let success = 0
    for (const p of prompts) {
      console.log(`[${success + 1}/${prompts.length}] ${p.title}`)
      if (await renderPrompt(p.id)) success++
    }
    console.log(`\nDone: ${success}/${prompts.length} rendered`)
  } else if (allPublishedFlag) {
    // Render all published prompts without thumbnails
    const prompts = await db.prompt.findMany({
      where: {
        status: 'PUBLISHED',
        thumbnailUrl: null,
        metadata: { not: Prisma.JsonNull },
      },
      select: { id: true, title: true },
    })
    console.log(`Found ${prompts.length} published prompts without thumbnails\n`)
    let success = 0
    for (const p of prompts) {
      console.log(`[${success + 1}/${prompts.length}] ${p.title}`)
      if (await renderPrompt(p.id)) success++
    }
    console.log(`\nDone: ${success}/${prompts.length} rendered`)
  } else {
    console.error('Usage:')
    console.error('  pnpm render:preview -- --prompt-id <id>     Render single prompt')
    console.error('  pnpm render:preview -- --all-pending         Render all pending without thumbnails')
    console.error('  pnpm render:preview -- --all-published       Render all published without thumbnails')
    process.exit(1)
  }

  await db.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
