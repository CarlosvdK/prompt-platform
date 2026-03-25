'use client'

export function DemoAnimation() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden max-w-md mx-auto animate-float">
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        <span className="ml-3 text-xs" style={{ color: '#64748b' }}>
          softset.dev
        </span>
      </div>

      <div className="p-6 space-y-5">
        {/* Step 1: Browse */}
        <div>
          <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              1
            </span>
            Browse
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['#667eea', '#764ba2', '#f093fb', '#4f46e5', '#7c3aed', '#a855f7'].map(
              (color, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg transition-all"
                  style={{
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                  }}
                />
              )
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center" style={{ color: '#4a5568' }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0v20M2 16l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Step 2: Copy Prompt */}
        <div>
          <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              2
            </span>
            Copy Prompt
          </p>
          <div
            className="rounded-lg p-3 font-mono text-xs leading-relaxed"
            style={{
              background: 'rgba(102,126,234,0.06)',
              border: '1px solid rgba(102,126,234,0.15)',
              color: '#c4b5fd',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Create a</span> pricing card{' '}
            <span style={{ color: '#94a3b8' }}>component with</span> React + Tailwind
            <span className="inline-block w-px h-3.5 ml-0.5 animate-pulse" style={{ background: '#667eea' }} />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center" style={{ color: '#4a5568' }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path d="M8 0v20M2 16l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Step 3: Get Code */}
        <div>
          <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#94a3b8' }}>
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              3
            </span>
            Get Code
          </p>
          <div
            className="rounded-lg p-3 font-mono text-xs leading-relaxed"
            style={{
              background: 'rgba(40,200,64,0.04)',
              border: '1px solid rgba(40,200,64,0.15)',
            }}
          >
            <span style={{ color: '#7c3aed' }}>export default</span>{' '}
            <span style={{ color: '#667eea' }}>function</span>{' '}
            <span style={{ color: '#f093fb' }}>PricingCard</span>
            <span style={{ color: '#94a3b8' }}>() {'{'}</span>
            <br />
            <span style={{ color: '#94a3b8' }}>{'  '}return (</span>
            <br />
            <span style={{ color: '#667eea' }}>{'    '}&lt;div</span>{' '}
            <span style={{ color: '#f093fb' }}>className</span>
            <span style={{ color: '#94a3b8' }}>=&quot;...&quot;</span>
            <span style={{ color: '#667eea' }}>&gt;</span>
            <br />
            <span style={{ color: '#94a3b8' }}>{'    '}...</span>
            <br />
            <span style={{ color: '#94a3b8' }}>{'  '});{' }'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
