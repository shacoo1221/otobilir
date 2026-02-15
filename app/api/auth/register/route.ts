import { NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/users"
import { upsertProfile } from "@/lib/profiles"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const exists = findUserByEmail(email)
    if (exists) return NextResponse.json({ error: "User exists" }, { status: 409 })
    const user = createUser({ name, email, password, avatar: "/images/placeholder.svg" })
    // create initial profile so profile page shows the registered name
    try {
      upsertProfile({ userId: user.id, name: user.name })
    } catch (e) {
      // ignore profile upsert errors in dev
    }
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email } }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

