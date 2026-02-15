export type Profile = {
  userId: string
  name?: string
  age?: number
  gender?: string
  bio?: string
  avatar?: string
  phone?: string
}

const PROFILES: Record<string, Profile> = {}

export function getProfile(userId: string): Profile | null {
  return PROFILES[userId] || null
}

export function upsertProfile(p: Profile) {
  PROFILES[p.userId] = { ...PROFILES[p.userId], ...p }
  return PROFILES[p.userId]
}

