"use client"

import * as React from "react"
import { cn } from "../../lib/cn"

export default function Dropdown({ trigger, items }: { trigger: React.ReactNode; items: { label: string; href?: string; onClick?: () => void }[] }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative inline-block text-left">
      <div onClick={() => setOpen((v) => !v)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-40">
          <div className="py-1">
            {items.map((it, i) => (
              <div
                key={i}
                onClick={() => {
                  setOpen(false)
                  it.onClick?.()
                }}
                className={cn("px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer")}
              >
                {it.href ? <a href={it.href}>{it.label}</a> : it.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

