export default function SettingsPage() {
  const envInfo = [
    {
      label: 'NODE_ENV',
      value: process.env.NODE_ENV ?? 'not set',
    },
    {
      label: 'AD_PROVIDER',
      value: process.env.AD_PROVIDER ?? 'not set',
    },
    {
      label: 'STORAGE_PROVIDER',
      value: process.env.STORAGE_PROVIDER ?? 'not set',
    },
  ]

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <div className="rounded-lg border border-border bg-muted/30 p-6 mb-8 text-center">
        <p className="text-muted-foreground">Settings configuration coming soon.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-4">Environment</h2>
        <div className="space-y-3">
          {envInfo.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg border border-border px-4 py-3 text-sm"
            >
              <span className="font-medium">{item.label}</span>
              <span className="rounded bg-muted px-2 py-0.5 font-mono text-muted-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
