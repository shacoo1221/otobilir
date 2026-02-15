import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { getProfile, upsertProfile } from "@/lib/profiles"

export async function GET(req: Request) {
  // Read profile only if authenticated; otherwise return null
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ profile: null })
    let userId = (token as any).user?.id || (token as any).sub
    // fallback: if token has email but no id, map email -> userId
    if (!userId && (token as any).user?.email) {
      const email = (token as any).user.email
      const { findUserByEmail } = await import('@/lib/users')
      const u = findUserByEmail(email)
      if (u) userId = u.id
    }
    if (!userId) return NextResponse.json({ profile: null })
    const p = getProfile(userId)
    return NextResponse.json({ profile: p })
  } catch (e) {
    return NextResponse.json({ profile: null })
  }
  // fallback to otobilir_user cookie if present (helps with session sync)
  const cookieHeader = req.headers.get("cookie") || ""
  if (cookieHeader) {
    const cookies = Object.fromEntries((cookieHeader as string).split(";").map((c) => {
      const [k, ...rest] = c.trim().split("=")
      return [k, rest.join("=")]
    }))
    const userIdCookie = cookies["otobilir_user"]
    if (userIdCookie) {
      const { findUserById } = await import('@/lib/users')
      const u = findUserById(userIdCookie)
      if (u) {
        const p = getProfile((u as any).id)
        return NextResponse.json({ profile: p })
      }
    }
  }
}

export async function PUT(req: Request) {
  // Strict: require NextAuth JWT/session
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    // debug info in dev to help diagnose missing session
    const cookieHeader = req.headers.get("cookie") || ""
    if (cookieHeader) {
      const cookies = Object.fromEntries((cookieHeader as string).split(";").map((c) => {
        const [k, ...rest] = c.trim().split("=")
        return [k, rest.join("=")]
      }))
      const userIdCookie = cookies["otobilir_user"]
      if (userIdCookie) {
        // allow cookie fallback in absence of token
        let userId = userIdCookie
        const { findUserById } = await import('@/lib/users')
        const u = findUserById(userIdCookie)
        if (u) userId = u.id
        // proceed to upsert profile using userId
        const body = await req.json()
        const p = upsertProfile({ userId, ...body })
        const res = NextResponse.json({ profile: p })
        return res
      }
    }
    if (process.env.NODE_ENV !== "production") {
      try { console.log("[debug] profile.PUT missing token; cookie:", cookieHeader) } catch {}
      return NextResponse.json({ error: "Unauthorized", debug: { cookie: cookieHeader } }, { status: 401 })
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  let userId = (token as any).user?.id || (token as any).sub
  // fallback: map token.user.email -> userId if missing
  if (!userId && (token as any).user?.email) {
    const email = (token as any).user.email
    const { findUserByEmail } = await import('@/lib/users')
    const u = findUserByEmail(email)
    if (u) userId = u.id
  }
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const p = upsertProfile({ userId, ...body })
  return NextResponse.json({ profile: p })
}

