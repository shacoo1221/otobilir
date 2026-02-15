const MAP: Record<string, string[]> = {}

export function getFavorites(userId: string) {
  return MAP[userId] || []
}

export function addFavorite(userId: string, listingId: string) {
  if (!MAP[userId]) MAP[userId] = []
  if (!MAP[userId].includes(listingId)) MAP[userId].push(listingId)
  return MAP[userId]
}

export function removeFavorite(userId: string, listingId: string) {
  if (!MAP[userId]) return []
  MAP[userId] = MAP[userId].filter((id) => id !== listingId)
  return MAP[userId]
}

