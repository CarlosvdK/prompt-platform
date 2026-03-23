import { describe, it, expect } from 'vitest'
import { createPromptSchema, listPromptsSchema } from '@/validations/prompt.schema'

describe('createPromptSchema', () => {
  it('should validate a valid prompt', () => {
    const result = createPromptSchema.safeParse({
      title: 'Test Prompt',
      description: 'A test prompt description that is long enough',
      content: 'This is the full prompt content that is long enough',
      type: 'TEXT',
      categoryId: 'cat_123',
    })
    expect(result.success).toBe(true)
  })

  it('should reject short title', () => {
    const result = createPromptSchema.safeParse({
      title: 'Te',
      description: 'A test prompt description',
      content: 'Content here',
      categoryId: 'cat_123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject missing categoryId', () => {
    const result = createPromptSchema.safeParse({
      title: 'Test Prompt',
      description: 'A test prompt description',
      content: 'Content here',
    })
    expect(result.success).toBe(false)
  })

  it('should accept valid prompt types', () => {
    const types = ['TEXT', 'CODE', 'SYSTEM_PROMPT', 'CHAIN', 'IMAGE']
    for (const type of types) {
      const result = createPromptSchema.safeParse({
        title: 'Test Prompt',
        description: 'A valid description for testing',
        content: 'Valid content for testing purposes',
        type,
        categoryId: 'cat_123',
      })
      expect(result.success).toBe(true)
    }
  })

  it('should default type to TEXT', () => {
    const result = createPromptSchema.safeParse({
      title: 'Test Prompt',
      description: 'A valid description for testing',
      content: 'Valid content for testing purposes',
      categoryId: 'cat_123',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe('TEXT')
    }
  })
})

describe('listPromptsSchema', () => {
  it('should provide defaults for pagination', () => {
    const result = listPromptsSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(12)
    }
  })

  it('should accept valid filters', () => {
    const result = listPromptsSchema.safeParse({
      categorySlug: 'coding',
      type: 'CODE',
      search: 'test',
      page: '2',
      limit: '24',
    })
    expect(result.success).toBe(true)
  })
})
