export function UnlockProgress() {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-muted-foreground">
        Verifying unlock...
      </p>
    </div>
  )
}
