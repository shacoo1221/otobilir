"use client"

import * as React from "react"

type Option = {
  value: string
  label: string
}

type Props = {
  label?: string
  value?: string
  onChange?: (v: string) => void
  options: Option[]
  placeholder?: string
}

export default function Select({ label, value, onChange, options, placeholder }: Props) {
  const reactId = React.useId?.() || Math.random().toString(36).slice(2, 9)
  const id = `select-${reactId}`
  return (
    <div className="flex flex-col">
      {label && <label htmlFor={id} className="text-sm text-gray-600 mb-2">{label}</label>}
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-md border px-3 py-2 bg-white"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

