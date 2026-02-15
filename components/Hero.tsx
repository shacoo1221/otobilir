"use client"

import { Search } from 'lucide-react'
import SearchAutocomplete from './SearchAutocomplete'

export default function Hero() {
  return (
    <section className="bg-[var(--color-bg)] py-12">
      <div className="container">
        <div className="bg-white rounded-xl shadow p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--color-primary)] hero-title">
              Arabanın Gerçek Değerini Öğren
            </h1>
            <p className="text-sm text-gray-600 mt-2">Otomobili, Otobilir.</p>

            <div className="mt-8 flex items-center justify-center">
              <div className="search-input" role="search" aria-label="Site araması">
                <Search className="text-gray-400" />
                <div style={{ flex: 1 }}>
                  <SearchAutocomplete id="hero-search" placeholder="Hangi arabayı merak ediyorsun?" onSelect={(car) => {
                    // navigate to compare with selected car as left
                    if (typeof window !== "undefined") {
                      window.location.href = `/compare?left=${encodeURIComponent(`${car.make}|${car.model}|${car.year}`)}`
                    }
                  }} />
                </div>
                <button className="search-btn" aria-label="Ara">Ara</button>
              </div>
            </div>
          </div>

          <div className="hidden md:block w-72">
            <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=60" alt="car" className="rounded-md"/>
          </div>
        </div>
      </div>
    </section>
  )
}

