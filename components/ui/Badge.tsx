"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/cn"

const badgeVariants = cva("inline-flex items-center px-2 py-1 text-sm font-semibold rounded-full", {
  variants: {
    variant: {
      default: "bg-[rgba(245,158,11,0.12)] text-[var(--color-secondary)]",
      success: "bg-emerald-50 text-emerald-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export default function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn(badgeVariants(), className)}>{children}</span>
}

