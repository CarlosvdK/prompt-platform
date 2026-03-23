import { describe, it, expect } from 'vitest'
import { canTransition, getNextStatuses } from '@/config/workflow'

describe('workflow', () => {
  describe('canTransition', () => {
    it('DRAFT can go to PENDING_REVIEW', () => {
      expect(canTransition('DRAFT', 'PENDING_REVIEW')).toBe(true)
    })

    it('DRAFT cannot go to PUBLISHED', () => {
      expect(canTransition('DRAFT', 'PUBLISHED')).toBe(false)
    })

    it('APPROVED can go to PUBLISHED', () => {
      expect(canTransition('APPROVED', 'PUBLISHED')).toBe(true)
    })

    it('PENDING_REVIEW can go to APPROVED, REJECTED, or NEEDS_CHANGES', () => {
      expect(canTransition('PENDING_REVIEW', 'APPROVED')).toBe(true)
      expect(canTransition('PENDING_REVIEW', 'REJECTED')).toBe(true)
      expect(canTransition('PENDING_REVIEW', 'NEEDS_CHANGES')).toBe(true)
    })

    it('PUBLISHED can only go to ARCHIVED', () => {
      expect(canTransition('PUBLISHED', 'ARCHIVED')).toBe(true)
      expect(canTransition('PUBLISHED', 'DRAFT')).toBe(false)
    })
  })

  describe('getNextStatuses', () => {
    it('returns valid next statuses for DRAFT', () => {
      expect(getNextStatuses('DRAFT')).toEqual(['PENDING_REVIEW'])
    })

    it('returns valid next statuses for PENDING_REVIEW', () => {
      const next = getNextStatuses('PENDING_REVIEW')
      expect(next).toContain('APPROVED')
      expect(next).toContain('REJECTED')
      expect(next).toContain('NEEDS_CHANGES')
    })
  })
})
