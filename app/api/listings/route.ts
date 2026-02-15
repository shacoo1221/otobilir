import { NextResponse } from "next/server"
import { listAll, createListing } from "@/lib/listings"
import { getToken } from "next-auth/jwt"

export async function GET() {
  const data = listAll()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // basic validation
    if (!body.title || !body.make || !body.model || !body.year || !body.priceTL) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    // try read owner from next-auth token
    let ownerId: string | undefined = undefined
    try {
      const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })
      if (token) {
        // token.user may exist from jwt callback
        ownerId = (token as any).user?.id || (token as any).sub
      }
    } catch (e) {
      // ignore
    }

    const item = createListing({
      title: body.title,
      make: body.make,
      model: body.model,
      year: String(body.year),
      priceTL: Number(body.priceTL),
      segment: body.segment || "",
      body: body.body || "",
      fuel: body.fuel || "",
      transmission: body.transmission || "",
      image: body.image || "/images/placeholder.svg",
      description: body.description || "",
      ownerId: ownerId || undefined,
    })
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }
}

