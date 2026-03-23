import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'
import { UserRole } from '@prisma/client'
import { ApiError } from './errors'

export async function getServerAuth() {
  return getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getServerAuth()
  if (!session?.user) throw new ApiError(401, 'Authentication required')
  return session.user
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role as UserRole)) throw new ApiError(403, 'Insufficient permissions')
  return user
}
