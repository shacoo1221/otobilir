 'use client'

import * as React from "react"
import CompareCard from "./CompareCard"
import { CAR_DB } from "../lib/cars"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

function unique(arr: string[]) {
  return Array.from(new Set(arr))
}

export default function CompareSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [left, setLeft] = React.useState<{ make?: string; model?: string; year?: string }>({})
  const [right, setRight] = React.useState<{ make?: string; model?: string; year?: string }>({})
  const [segmentFilter, setSegmentFilter] = React.useState<string>("")
  const [priceMin, setPriceMin] = React.useState<number | "">("")
  const [priceMax, setPriceMax] = React.useState<number | "">("")
  const [fuelFilter, setFuelFilter] = React.useState<string>("")
  const [transmissionFilter, setTransmissionFilter] = React.useState<string>("")
  const [bodyFilter, setBodyFilter] = React.useState<string>("")
  const yearsAll = unique(CAR_DB.map((c) => c.year))
  const minYearAll = Math.min(...yearsAll.map((y) => Number(y)))
  const maxYearAll = Math.max(...yearsAll.map((y) => Number(y)))
  const [yearMin, setYearMin] = React.useState<number | "">(minYearAll)
  const [yearMax, setYearMax] = React.useState<number | "">(maxYearAll)
  // Initialize filters from URL on mount
  React.useEffect(() => {
    if (!searchParams) return
    const s = searchParams
    const sf = s.get("segment") || ""
    const pmin = s.get("pmin") || ""
    const pmax = s.get("pmax") || ""
    const fuel = s.get("fuel") || ""
    const trans = s.get("trans") || ""
    const body = s.get("body") || ""
    const ymin = s.get("ymin") || ""
    const ymax = s.get("ymax") || ""

    setSegmentFilter(sf)
    setPriceMin(pmin === "" ? "" : Number(pmin))
    setPriceMax(pmax === "" ? "" : Number(pmax))
    setFuelFilter(fuel)
    setTransmissionFilter(trans)
    setBodyFilter(body)
    setYearMin(ymin === "" ? "" : Number(ymin))
    setYearMax(ymax === "" ? "" : Number(ymax))
  }, [searchParams])

  // Server-driven filtering: fetch filtered list from API
  const [filteredDB, setFilteredDB] = React.useState(CAR_DB)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function fetchFiltered() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (segmentFilter) params.set("segment", segmentFilter)
        if (fuelFilter) params.set("fuel", fuelFilter)
        if (transmissionFilter) params.set("trans", transmissionFilter)
        if (bodyFilter) params.set("body", bodyFilter)
        if (priceMin !== "") params.set("pmin", String(priceMin))
        if (priceMax !== "") params.set("pmax", String(priceMax))
        if (yearMin !== "") params.set("ymin", String(yearMin))
        if (yearMax !== "") params.set("ymax", String(yearMax))

        const res = await fetch(`/api/cars?${params.toString()}`)
        if (!res.ok) throw new Error("API error")
        const data = await res.json()
        if (!mounted) return
        setFilteredDB(data)
      } catch (err) {
        if (!mounted) return
        setError((err as Error).message)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    fetchFiltered()
    return () => {
      mounted = false
    }
  }, [segmentFilter, fuelFilter, transmissionFilter, bodyFilter, priceMin, priceMax, yearMin, yearMax])

  // Sync filters to URL
  React.useEffect(() => {
    if (!pathname || !router) return
    const params = new URLSearchParams()
    if (segmentFilter) params.set("segment", segmentFilter)
    if (fuelFilter) params.set("fuel", fuelFilter)
    if (transmissionFilter) params.set("trans", transmissionFilter)
    if (bodyFilter) params.set("body", bodyFilter)
    if (priceMin !== "") params.set("pmin", String(priceMin))
    if (priceMax !== "") params.set("pmax", String(priceMax))
    if (yearMin !== "") params.set("ymin", String(yearMin))
    if (yearMax !== "") params.set("ymax", String(yearMax))

    const qs = params.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    // update URL without causing navigation/scroll
    if (typeof window !== "undefined" && window.history && window.history.replaceState) {
      window.history.replaceState(null, "", url)
    }
  }, [segmentFilter, fuelFilter, transmissionFilter, bodyFilter, priceMin, priceMax, yearMin, yearMax, pathname, router])

  const makes = unique(filteredDB.map((c) => c.make))
  const models = unique(filteredDB.map((c) => c.model))
  const years = unique(filteredDB.map((c) => c.year))
  const segments = unique(CAR_DB.map((c) => c.segment || ""))
  const fuels = unique(CAR_DB.map((c) => c.specs?.fuel || "").filter(Boolean) as string[])
  const transmissions = unique(CAR_DB.map((c) => c.specs?.transmission || "").filter(Boolean) as string[])
  const bodies = unique(CAR_DB.map((c) => c.body || "").filter(Boolean) as string[])

  const findImage = (sel: { make?: string; model?: string; year?: string }) => {
    const found = CAR_DB.find(
      (c) =>
        (sel.make ? c.make === sel.make : true) &&
        (sel.model ? c.model === sel.model : true) &&
        (sel.year ? c.year === sel.year : true)
    )
    return found?.image
  }

  const leftImage = findImage(left)
  const rightImage = findImage(right)

  const bothSelected = !!(left.make && left.model && left.year && right.make && right.model && right.year)

  const handleCompare = () => {
    if (!bothSelected) return
    const encode = (s: { make?: string; model?: string; year?: string }) =>
      encodeURIComponent(`${s.make}|${s.model}|${s.year}`)
    router.push(`/compare?left=${encode(left)}&right=${encode(right)}`)
  }

  return (
    <section className="container mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Araç Karşılaştırma</h2>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-end gap-4">
        <div>
          <label htmlFor="filter-segment" className="text-sm text-gray-600 mb-1 block">Kategori / Segment</label>
          <select id="filter-segment" name="segment" value={segmentFilter} onChange={(e) => setSegmentFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Tümü</option>
            {segments.map((s) => (
              s && <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="filter-fuel" className="text-sm text-gray-600 mb-1 block">Yakıt Tipi</label>
          <select id="filter-fuel" name="fuel" value={fuelFilter} onChange={(e) => setFuelFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Tümü</option>
            {fuels.map((f) => f && <option key={f} value={f}>{f}</option>)}
            <option value="Dizel">Dizel</option>
            <option value="Hibrit">Hibrit</option>
            <option value="Elektrik">Elektrik</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-trans" className="text-sm text-gray-600 mb-1 block">Vites Tipi</label>
          <select id="filter-trans" name="transmission" value={transmissionFilter} onChange={(e) => setTransmissionFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Tümü</option>
            {transmissions.map((t) => t && <option key={t} value={t}>{t}</option>)}
            <option value="Yarı Otomatik">Yarı Otomatik</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-body" className="text-sm text-gray-600 mb-1 block">Kasa Tipi</label>
          <select id="filter-body" name="body" value={bodyFilter} onChange={(e) => setBodyFilter(e.target.value)} className="rounded-md border px-3 py-2">
            <option value="">Tümü</option>
            {bodies.map((b) => b && <option key={b} value={b}>{b}</option>)}
            <option value="Station Wagon">Station Wagon</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <label htmlFor="filter-ymin" className="text-sm text-gray-600 mb-1 block">Yıl Min</label>
            <input id="filter-ymin" name="ymin" type="number" min={minYearAll} max={maxYearAll} value={yearMin === "" ? "" : yearMin} onChange={(e) => setYearMin(e.target.value === "" ? "" : Number(e.target.value))} className="rounded-md border px-3 py-2 w-28" />
          </div>
          <div>
            <label htmlFor="filter-ymax" className="text-sm text-gray-600 mb-1 block">Yıl Max</label>
            <input id="filter-ymax" name="ymax" type="number" min={minYearAll} max={maxYearAll} value={yearMax === "" ? "" : yearMax} onChange={(e) => setYearMax(e.target.value === "" ? "" : Number(e.target.value))} className="rounded-md border px-3 py-2 w-28" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <label htmlFor="filter-pmin" className="text-sm text-gray-600 mb-1 block">Fiyat Min (₺)</label>
            <input id="filter-pmin" name="pmin" type="number" value={priceMin === "" ? "" : priceMin} onChange={(e) => setPriceMin(e.target.value === "" ? "" : Number(e.target.value))} className="rounded-md border px-3 py-2 w-40" />
          </div>
          <div>
            <label htmlFor="filter-pmax" className="text-sm text-gray-600 mb-1 block">Fiyat Max (₺)</label>
            <input id="filter-pmax" name="pmax" type="number" value={priceMax === "" ? "" : priceMax} onChange={(e) => setPriceMax(e.target.value === "" ? "" : Number(e.target.value))} className="rounded-md border px-3 py-2 w-40" />
          </div>
        </div>

        <div className="ml-auto">
          <button onClick={() => { setSegmentFilter(""); setPriceMin(""); setPriceMax("") }} className="btn btn-ghost">Filtreleri temizle</button>
        </div>
      </div>
      {filteredDB.length === 0 ? (
        <div className="w-full p-6 bg-yellow-50 border rounded-md text-sm text-yellow-800">
          Kriterlerinize uygun araç bulunamadı.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          <div style={{ flex: "0 0 49%", minWidth: 360 }}>
            <CompareCard
              title="1. Aracı Seç"
              value={left}
              onChange={setLeft}
              makes={makes}
              models={models}
              years={years}
              image={leftImage}
            />
          </div>

          <div style={{ flex: "0 0 49%", minWidth: 360 }}>
            <CompareCard
              title="2. Aracı Seç"
              value={right}
              onChange={setRight}
              makes={makes}
              models={models}
              years={years}
              image={rightImage}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          disabled={!bothSelected}
          onClick={handleCompare}
          className={`btn ${bothSelected ? "btn-primary" : "btn-ghost"}`}
        >
          Karşılaştırmayı Gör
        </button>
      </div>
    </section>
  )
}

