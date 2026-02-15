import { NextResponse } from "next/server"
import { getFavorites, addFavorite, removeFavorite } from "@/lib/favorites"
import { getListing } from "@/lib/listings"
import { getToken } from "next-auth/jwt"

async function getUserId(req: Request) {
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return null
  return (token as any).user?.id || (token as any).sub || null
}

export async function GET(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ favorites: [] })
  const favs = getFavorites(userId)
  const enriched = favs.map((id) => {
    const l = getListing(id)
    return l
      ? { id: l.id, title: l.title, make: l.make, model: l.model, year: l.year, image: l.image, priceTL: l.priceTL }
      : { id }
  })
  return NextResponse.json({ favorites: enriched })
}

export async function POST(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { listingId } = body
  if (!listingId) return NextResponse.json({ error: "Missing listingId" }, { status: 400 })
  const updated = addFavorite(userId, listingId)
  return NextResponse.json({ favorites: updated })
}

export async function DELETE(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const updated = removeFavorite(userId, id)
  return NextResponse.json({ favorites: updated })
}

