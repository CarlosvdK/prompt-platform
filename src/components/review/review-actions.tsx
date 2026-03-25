'use client'

import { useState } from 'react'
import { Check, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ReviewNotes } from './review-notes'
import { useReviewActions } from '@/hooks/use-review-actions'

interface ReviewActionsProps {
  promptId: string
  onComplete?: () => void
}

type ActionType = 'reject' | 'changes' | null

export function ReviewActions({ promptId, onComplete }: ReviewActionsProps) {
  const [dialogAction, setDialogAction] = useState<ActionType>(null)
  const [notes, setNotes] = useState('')
  const [scores, setScores] = useState({
    scoreVisual: 0,
    scoreAlignment: 0,
    scoreTechnical: 0,
    scoreAccessibility: 0,
  })
  const { approve, reject, requestChanges, loading } = useReviewActions()

  const activeScores = Object.fromEntries(
    Object.entries(scores).filter(([, v]) => v > 0)
  )

  const handleApprove = async () => {
    await approve(promptId, undefined, activeScores)
    onComplete?.()
  }

  const handleSubmitWithNotes = async () => {
    if (!dialogAction || !notes.trim()) return

    if (dialogAction === 'reject') {
      await reject(promptId, notes, activeScores)
    } else {
      await requestChanges(promptId, notes, activeScores)
    }
    setDialogAction(null)
    setNotes('')
    setScores({ scoreVisual: 0, scoreAlignment: 0, scoreTechnical: 0, scoreAccessibility: 0 })
    onComplete?.()
  }

  return (
    <>
      <div className="space-y-3 mt-4 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quality Score (optional)</p>
        {[
          { key: 'scoreVisual', label: 'Visual Fidelity' },
          { key: 'scoreAlignment', label: 'Prompt Alignment' },
          { key: 'scoreTechnical', label: 'Technical Quality' },
          { key: 'scoreAccessibility', label: 'Accessibility' },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setScores((s) => ({ ...s, [key]: s[key as keyof typeof s] === n ? 0 : n }))}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-all ${
                    scores[key as keyof typeof scores] >= n
                      ? 'bg-[#667eea] text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleApprove}
          disabled={loading.approve}
          className="gap-1 bg-green-600 text-white hover:bg-green-700"
        >
          {loading.approve ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Approve
        </Button>

        <Button
          variant="outline"
          onClick={() => setDialogAction('changes')}
          disabled={loading.requestChanges}
          className="gap-1 border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
        >
          <RotateCcw className="h-4 w-4" />
          Request Changes
        </Button>

        <Button
          variant="outline"
          onClick={() => setDialogAction('reject')}
          disabled={loading.reject}
          className="gap-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <X className="h-4 w-4" />
          Reject
        </Button>
      </div>

      <Dialog
        open={dialogAction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialogAction(null)
            setNotes('')
            setScores({ scoreVisual: 0, scoreAlignment: 0, scoreTechnical: 0, scoreAccessibility: 0 })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'reject' ? 'Reject Prompt' : 'Request Changes'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'reject'
                ? 'Please provide a reason for rejecting this prompt.'
                : 'Describe what changes are needed.'}
            </DialogDescription>
          </DialogHeader>

          <ReviewNotes value={notes} onChange={setNotes} required />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogAction(null)
                setNotes('')
                setScores({ scoreVisual: 0, scoreAlignment: 0, scoreTechnical: 0, scoreAccessibility: 0 })
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitWithNotes}
              disabled={
                !notes.trim() ||
                (dialogAction === 'reject' ? loading.reject : loading.requestChanges)
              }
              className={
                dialogAction === 'reject'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }
            >
              {dialogAction === 'reject' ? 'Reject' : 'Request Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
