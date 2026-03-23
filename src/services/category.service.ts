import { db } from '@/lib/db'

export async function listCategories() {
  return db.category.findMany({ orderBy: { sortOrder: 'asc' } })
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({ where: { slug } })
}

export async function listTags() {
  return db.tag.findMany({ orderBy: { name: 'asc' } })
}

export async function getTagBySlug(slug: string) {
  return db.tag.findUnique({ where: { slug } })
}
