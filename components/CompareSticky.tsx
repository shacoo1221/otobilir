"use client"

import * as React from "react"

export default function CompareSticky({ left, right }: { left: any; right: any }) {
  const [active, setActive] = React.useState(false)

  React.useEffect(() => {
    const sentinel = document.getElementById("cmp-sentinel")
    if (!sentinel) return

    function check() {
      const rect = sentinel.getBoundingClientRect()
      // show floating header when sentinel's top is at or above the top of viewport
      setActive(rect.top <= 0)
    }

    // initial check
    check()
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  if (!active) return null

  return (
    <div className="cmp-sticky cmp-sticky--floating" role="region" aria-label="Karşılaştırılan araçlar">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {left ? <img src={left.image} alt={`${left.make} ${left.model}`} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} /> : null}
          <div className="font-semibold">{left ? `${left.make} ${left.model}` : "-"}</div>
        </div>
        <div className="text-sm text-gray-500">Karşılaştırılıyor</div>
        <div className="flex items-center gap-3">
          {right ? <img src={right.image} alt={`${right.make} ${right.model}`} style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6 }} /> : null}
          <div className="font-semibold">{right ? `${right.make} ${right.model}` : "-"}</div>
        </div>
      </div>
    </div>
  )
}

