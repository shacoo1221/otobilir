import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { findUserById } from "@/lib/users"

export async function GET(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return NextResponse.json({ ok: false }, { status: 401 })
    const userId = (token as any).user?.id || (token as any).sub
    if (!userId) return NextResponse.json({ ok: false }, { status: 401 })
    const user = findUserById(userId)
    if (!user) return NextResponse.json({ ok: false }, { status: 404 })
    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
    // set HttpOnly application cookie to help legacy endpoints
    res.headers.set("Set-Cookie", `otobilir_user=${user.id}; Path=/; HttpOnly; Max-Age=${60*60*24*30}`)
    return res
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

