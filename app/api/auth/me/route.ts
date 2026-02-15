import { NextResponse } from "next/server"
import { findUserById } from "@/lib/users"
import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {
  // try next-auth token first
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || "dev-secret" })
    if (token) {
      // In development return token payload for debugging
      if (process.env.NODE_ENV !== "production") {
        try { console.log("DEBUG /api/auth/me token:", token) } catch {}
      }
      const userId = (token as any).user?.id || (token as any).sub
      if (userId) {
        const user = findUserById(userId)
        if (user) return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar }, token })
      }
      // if no userId but token present, expose token in dev for diagnosis
      if (process.env.NODE_ENV !== "production") return NextResponse.json({ user: null, token })
    }
  } catch (e) {
    // ignore
  }

  // fallback to original cookie (otobilir_user)
  const cookieHeader = req.headers.get("cookie")
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split(";").map((c) => {
      const [k, ...rest] = c.trim().split("=")
      return [k, rest.join("=")]
    }))
    const userId = cookies["otobilir_user"]
    if (userId) {
      const user = findUserById(userId)
      if (user) return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } })
    }
  }

  return NextResponse.json({ user: null })
}

