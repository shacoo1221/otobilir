import { NextResponse } from "next/server"
import { authenticate } from "@/lib/users"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    const user = authenticate(email, password)
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } })
    // set simple session cookie (dev only)
    res.headers.set("Set-Cookie", `otobilir_user=${user.id}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24}`)
    return res
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

