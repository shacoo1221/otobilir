type SavedComparison = {
  id: string
  userId: string
  left: string
  right: string
  createdAt: string
}

const STORE: SavedComparison[] = []

export function listSaved(userId: string) {
  return STORE.filter((s) => s.userId === userId)
}

export function createSaved(userId: string, left: string, right: string) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`
  const item = { id, userId, left, right, createdAt: new Date().toISOString() }
  STORE.unshift(item)
  return item
}

export function deleteSaved(userId: string, id: string) {
  const idx = STORE.findIndex((s) => s.id === id && s.userId === userId)
  if (idx === -1) return false
  STORE.splice(idx, 1)
  return true
}

