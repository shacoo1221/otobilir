import { NextResponse } from "next/server"
import { CAR_DB } from "@/lib/cars"

function toNumber(v: string | null) {
  if (!v) return null
  const n = Number(v)
  return Number.isNaN(n) ? null : n
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams

  const segment = q.get("segment") || ""
  const fuel = q.get("fuel") || ""
  const trans = q.get("trans") || ""
  const body = q.get("body") || ""
  const pmin = toNumber(q.get("pmin"))
  const pmax = toNumber(q.get("pmax"))
  const ymin = toNumber(q.get("ymin"))
  const ymax = toNumber(q.get("ymax"))
  const make = q.get("make") || ""
  const model = q.get("model") || ""
  const year = q.get("year") || ""

  const result = CAR_DB.filter((c) => {
    if (segment && c.segment !== segment) return false
    if (fuel && c.specs?.fuel !== fuel) return false
    if (trans && c.specs?.transmission !== trans) return false
    if (body && c.body !== body) return false
    if (pmin != null && typeof c.priceTL === "number" && c.priceTL < pmin) return false
    if (pmax != null && typeof c.priceTL === "number" && c.priceTL > pmax) return false
    if (ymin != null && Number(c.year) < ymin) return false
    if (ymax != null && Number(c.year) > ymax) return false
    if (make && c.make !== make) return false
    if (model && c.model !== model) return false
    if (year && c.year !== year) return false
    return true
  })

  return NextResponse.json(result)
}

