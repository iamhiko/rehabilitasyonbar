"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("cocktails")

  const categories = [
    { id: "cocktails", name: "Kokteyller" },
    { id: "drinks", name: "İçecekler" },
    { id: "food", name: "Yiyecekler" },
  ]

  return (
    <section id="menu" className="section bg-neutral-950">
      <div className="container-custom">
        <h2 className="text-4xl font-bold text-center mb-12 text-amber-500">Menümüz</h2>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-neutral-950 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md text-sm md:text-base transition-all ${
                  activeCategory === category.id ? "bg-amber-600 text-white" : "text-zinc-300 hover:text-white"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Menü öğeleri buraya gelecek */}
        </div>
      </div>
    </section>
  )
}
