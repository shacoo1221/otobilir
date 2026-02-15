import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }
  const cookieHeader = req.headers.get("cookie")
  let token = null
  try {
    token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || undefined })
  } catch (e) {
    // ignore
  }
  return NextResponse.json({ cookieHeader, token })
}

