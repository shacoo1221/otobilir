"use client"

import * as React from "react"
import { CAR_DB } from "@/lib/cars"
import { Search } from "lucide-react"

type Props = {
  id?: string
  placeholder?: string
  onSelect?: (car: any) => void
}

export default function SearchAutocomplete({ id = "global-search", placeholder = "Hangi arabayı merak ediyorsun?", onSelect }: Props) {
  const [q, setQ] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [index, setIndex] = React.useState(0)

  const results = React.useMemo(() => {
    if (!q) return []
    const txt = q.toLowerCase()
    return CAR_DB.filter((c) => `${c.make} ${c.model}`.toLowerCase().includes(txt)).slice(0, 6)
  }, [q])

  React.useEffect(() => {
    setIndex(0)
    setOpen(results.length > 0)
  }, [results])

  function choose(c: any) {
    setQ(`${c.make} ${c.model}`)
    setOpen(false)
    onSelect?.(c)
  }

  const listId = `${id}-listbox`

  return (
    <div className="relative" style={{ minWidth: 240 }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <label htmlFor={id} style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(1px,1px,1px,1px)" }}>
          Ara
        </label>
        <input
          id={id}
          name="q"
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-activedescendant={open && results[index] ? `${id}-option-${index}` : undefined}
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(results.length > 0)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setIndex((i) => Math.min(i + 1, results.length - 1))
              setOpen(true)
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              setIndex((i) => Math.max(i - 1, 0))
              setOpen(true)
            } else if (e.key === "Enter") {
              e.preventDefault()
              if (results[index]) choose(results[index])
            } else if (e.key === "Escape") {
              setOpen(false)
            }
          }}
          className="w-full pl-10 pr-4 py-2 rounded-full border"
          placeholder={placeholder}
        />
      </div>

      {open && results.length > 0 && (
        <div id={listId} role="listbox" className="absolute z-50 mt-2 w-full bg-white rounded-md shadow-lg overflow-hidden" aria-label="Arama önerileri">
          {results.map((r, i) => (
            <button
              id={`${id}-option-${i}`}
              key={`${r.make}-${r.model}-${r.year}`}
              role="option"
              aria-selected={i === index}
              onMouseDown={(ev) => {
                ev.preventDefault()
                choose(r)
              }}
              className={`autocomplete-item w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 ${i === index ? "bg-gray-50" : ""}`}
            >
              <img src={r.image} alt={`${r.make} ${r.model}`} style={{ width: 48, height: 32, objectFit: "cover", borderRadius: 6 }} />
              <div>
                <div className="font-semibold text-sm">{r.make} {r.model}</div>
                <div className="text-xs text-gray-500">{r.year} • {r.segment}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

