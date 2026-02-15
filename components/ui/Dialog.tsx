"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export function Dialog({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (val: boolean) => void; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg">
        {children}
        <DialogPrimitive.Close className="absolute right-3 top-3">✕</DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

