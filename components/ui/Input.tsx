 "use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"

const inputVariants = cva("w-full rounded-md border px-3 py-2 focus:outline-none", {
  variants: {
    variant: {
      default: "border-gray-200",
      subtle: "border-transparent bg-gray-50",
    },
    size: {
      default: "py-2",
      lg: "py-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type Props = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants> & {
  label?: string
}

export default function Input({ label, className, variant, size, ...props }: Props) {
  const reactId = React.useId?.() || Math.random().toString(36).slice(2, 9)
  const id = (props && (props as any).id) || `input-${reactId}`
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="text-sm text-gray-600 mb-1">{label}</label>}
      <input id={id} className={cn(inputVariants({ variant, size }), className)} {...props} />
    </div>
  )
}

