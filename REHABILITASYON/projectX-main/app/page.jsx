"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import CategorySection from "@/components/CategorySection"
import Footer from "@/components/Footer"
import About from "@/components/About"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export default function Home() {
  const [menu, setMenu] = useState({})
  const contactInfo = {
    address: "Altınkum, Yalı Cd. No:105, 09270 Didim/Aydın",
    phone: "0554 023 58 62"
  }

  useEffect(() => {
    // Set up real-time listener for menu only
    const menuUnsubscribe = onSnapshot(doc(db, "content", "menu"), (menuDoc) => {
      if (menuDoc.exists()) {
        const menuData = menuDoc.data()
        console.log("Menu data updated:", menuData)
        setMenu(menuData)
      }
    })

    return () => {
      menuUnsubscribe()
    }
  }, [])

  return (
    <main className="min-h-screen bg-slate-200">
      <Navbar />
      <Hero />
      <CategorySection menu={menu} />
      <About />
      <Footer contactInfo={contactInfo} />
    </main>
  )
}
