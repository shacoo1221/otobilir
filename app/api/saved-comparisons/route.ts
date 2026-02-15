import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { listSaved, createSaved, deleteSaved } from "@/lib/savedComparisons"

async function getUserId(req: Request) {
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return null
  return (token as any).user?.id || (token as any).sub || null
}

export async function GET(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ saved: [] })
  const items = listSaved(userId)
  return NextResponse.json({ saved: items })
}

export async function POST(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { left, right } = body
  if (!left || !right) return NextResponse.json({ error: "Missing" }, { status: 400 })
  const item = createSaved(userId, left, right)
  return NextResponse.json(item, { status: 201 })
}

export async function DELETE(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const ok = deleteSaved(userId, id)
  return NextResponse.json({ success: ok })
}

