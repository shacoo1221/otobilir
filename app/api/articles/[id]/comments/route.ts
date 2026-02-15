import { NextResponse } from "next/server"
import { listComments, createComment, getArticle } from "@/lib/articles"
import { getToken } from "next-auth/jwt"
import { findUserById } from "@/lib/users"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ comments: [] })
  return NextResponse.json(listComments(id))
}

export async function POST(req: Request) {
  const body = await req.json()
  const { articleId, text } = body
  if (!articleId || !text) return NextResponse.json({ error: "Missing" }, { status: 400 })
  const article = getArticle(articleId)
  if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 })
  // Require authenticated user via NextAuth token
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (token as any).user?.id || (token as any).sub
  const authorName = (token as any).user?.name || null
  const authorAvatar = (token as any).user?.avatar || null

  const c = createComment(articleId, userId, authorName, authorAvatar, text)
  return NextResponse.json(c, { status: 201 })
}

