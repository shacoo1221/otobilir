export type Listing = {
  id: string
  title: string
  make: string
  model: string
  year: string
  priceTL: number
  segment?: string
  body?: string
  fuel?: string
  transmission?: string
  image?: string
  description?: string
  ownerId?: string
  createdAt: string
}

// In-memory mock store (dev only)
const STORE: Listing[] = []

export function listAll() {
  return STORE
}

export function getListing(id: string) {
  return STORE.find((l) => l.id === id) || null
}

export function createListing(data: Omit<Listing, "id" | "createdAt">) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const item: Listing = { ...data, id, createdAt: new Date().toISOString() }
  STORE.unshift(item)
  return item
}

export function updateListing(id: string, patch: Partial<Listing>) {
  const idx = STORE.findIndex((l) => l.id === id)
  if (idx === -1) return null
  STORE[idx] = { ...STORE[idx], ...patch }
  return STORE[idx]
}

export function deleteListing(id: string) {
  const idx = STORE.findIndex((l) => l.id === id)
  if (idx === -1) return false
  STORE.splice(idx, 1)
  return true
}

