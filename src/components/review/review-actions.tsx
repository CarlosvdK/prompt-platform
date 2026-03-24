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
  const { approve, reject, requestChanges, loading } = useReviewActions()

  const handleApprove = async () => {
    await approve(promptId)
    onComplete?.()
  }

  const handleSubmitWithNotes = async () => {
    if (!dialogAction || !notes.trim()) return

    if (dialogAction === 'reject') {
      await reject(promptId, notes)
    } else {
      await requestChanges(promptId, notes)
    }
    setDialogAction(null)
    setNotes('')
    onComplete?.()
  }

  return (
    <>
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
