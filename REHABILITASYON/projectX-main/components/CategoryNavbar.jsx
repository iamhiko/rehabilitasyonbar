"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CategoryNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-neutral-950/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container-custom flex justify-between items-center py-3 md:py-4 px-6 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-righteous text-zinc-100 tracking-wider hover:text-amber-300 transition-colors">
          <img src="/category-images/logo.png" alt="Rehabilitasyon Bar Logo" className="h-8 md:h-10" />
          REHABİLİTASYON ADMİN
        </Link>

        <Link 
          href="/" 
          className="text-amber-500 hover:text-amber-400 inline-flex items-center text-base md:text-lg lg:text-xl font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-all"
        >
          <ArrowLeft size={20} className="mr-2" /> Ana Sayfaya Dön
        </Link>
      </div>
    </nav>
  )
} 