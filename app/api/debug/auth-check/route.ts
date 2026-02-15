import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Debug endpoint to inspect incoming cookies and token decoding result.
// Protected by DEPLOY_DEBUG_KEY env var. Call like: /api/debug/auth-check?key=SECRET
export async function GET(req: Request) {
  const url = new URL(req.url)
  const key = url.searchParams.get("key")
  if (!process.env.DEPLOY_DEBUG_KEY || key !== process.env.DEPLOY_DEBUG_KEY) {
    return NextResponse.json({ ok: false, error: "Not allowed" }, { status: 403 })
  }

  const cookieHeader = req.headers.get("cookie") || null
  let tokenResult: any = null
  let tokenError: string | null = null
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || undefined })
    tokenResult = token ? { ok: true, sub: (token as any).sub || (token as any).user?.id || null } : { ok: false }
  } catch (e: any) {
    tokenError = e?.message || String(e)
  }

  return NextResponse.json({
    ok: true,
    cookieHeader,
    tokenResult,
    tokenError,
  })
}

