"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    // trigger fade-out then fade-in on route change
    setShow(false)
    const t = setTimeout(() => setShow(true), 80)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className={`page-transition ${show ? "pt-show" : "pt-hide"}`}>
      {children}
    </div>
  )
}

