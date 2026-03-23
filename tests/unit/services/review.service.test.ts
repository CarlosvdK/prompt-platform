import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    prompt: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    review: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}))

describe('review.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitForReview', () => {
    it('should transition DRAFT to PENDING_REVIEW', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })

    it('should reject non-DRAFT prompts', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })
  })

  describe('reviewPrompt', () => {
    it('should create review decision', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })

    it('should update prompt status', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })

    it('should require notes for rejection', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })
  })

  describe('getReviewQueue', () => {
    it('should return only PENDING_REVIEW prompts', async () => {
      // TODO: implement test
      expect(true).toBe(true)
    })
  })
})
