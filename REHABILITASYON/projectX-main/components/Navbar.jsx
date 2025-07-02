"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
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

  const scrollToContact = (e) => {
    e.preventDefault()
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      const navbarHeight = 80
      window.scrollTo({
        top: contactSection.offsetTop - navbarHeight,
        behavior: 'smooth'
      })
      setIsOpen(false)
    }
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-neutral-950/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container-custom flex justify-between items-center py-3 md:py-4 px-6 md:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-xl md:text-2xl font-righteous text-zinc-100 tracking-wider hover:text-amber-300 transition-colors">
          <img src="/category-images/logo.png" alt="Rehabilitasyon Bar Logo" className="h-10 md:h-12 lg:h-14" />
          REHABİLİTASYON BAR
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 lg:space-x-8">
          <Link href="/" className="text-sm lg:text-base text-zinc-300 hover:text-amber-500 transition-colors">
            Ana Sayfa
          </Link>
          <Link href="#about" className="text-sm lg:text-base text-zinc-300 hover:text-amber-500 transition-colors">
            Hakkımızda
          </Link>
          <button onClick={scrollToContact} className="text-sm lg:text-base text-zinc-300 hover:text-amber-500 transition-colors">
            İletişim
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-zinc-300 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-neutral-950/95 shadow-xl backdrop-blur-sm px-6 md:px-8 lg:px-12">
          <div className="flex flex-col space-y-3 py-3">
            <Link
              href="/"
              className="text-sm text-zinc-300 hover:text-amber-500 transition-colors py-1"
              onClick={() => setIsOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              href="#about"
              className="text-sm text-zinc-300 hover:text-amber-500 transition-colors py-1"
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
            <button
              onClick={scrollToContact}
              className="text-sm text-left text-zinc-300 hover:text-amber-500 transition-colors py-1"
            >
              İletişim
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
