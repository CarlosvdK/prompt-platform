'use client'

import { Textarea } from '@/components/ui/textarea'

interface ReviewNotesProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
  maxLength?: number
}

export function ReviewNotes({
  value,
  onChange,
  required = false,
  maxLength = 1000,
}: ReviewNotesProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Notes
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
        <span className="text-xs text-muted-foreground">
          {value.length}/{maxLength}
        </span>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder="Enter review notes..."
        rows={4}
        required={required}
      />
    </div>
  )
}
