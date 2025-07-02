"use client"

import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  const scrollToCategories = (e) => {
    e.preventDefault()
    const categoriesSection = document.getElementById("categories")
    if (categoriesSection) {
      const offset = 80 // Navbar yüksekliği için offset
      const elementPosition = categoriesSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="relative h-screen flex items-center justify-center bg-zinc-900">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/category-images/anaekranwallpaper.jpg"
          alt="Bar background"
          fill
          priority
          quality={75}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black bg-opacity-60"></div>

      <div className="container-custom relative z-20 text-center px-4 mt-[-100px]">
        
        <div className="flex flex-row justify-center gap-3 md:gap-4 mt-[144px] md:mt-[176px]">
          <button 
            onClick={scrollToCategories} 
            className="btn btn-primary text-base md:text-xl lg:text-2xl font-righteous font-medium tracking-widest relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10">MENÜYÜ GÖR</span>
            <div className="absolute inset-0 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.3)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] transition-shadow duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}
