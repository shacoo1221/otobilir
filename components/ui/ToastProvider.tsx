"use client"

import * as React from "react"

type Toast = { id: string; title?: string; message: string; type?: "success" | "error" }

const ToastContext = React.createContext<(t: Omit<Toast, "id">) => void>(() => {})

export function useToast() {
  return React.useContext(ToastContext)
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  function push(t: Omit<Toast, "id">) {
    const id = Math.random().toString(36).slice(2, 9)
    const nt: Toast = { id, ...t }
    setToasts((s) => [nt, ...s])
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id))
    }, 3500)
  }
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type === "error" ? "toast-error" : "toast-success"}`} role="status" aria-live="polite" style={{ minWidth: 220 }}>
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

