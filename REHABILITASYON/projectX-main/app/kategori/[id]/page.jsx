"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"
import Link from "next/link"
import { Search } from "lucide-react"

// URL-friendly slug oluşturma fonksiyonu
const createUrlSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/İ/g, 'i')
        .replace(/Ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/Ö/g, 'o')
        .replace(/Ç/g, 'c')
        .replace(/\s+/g, '-')
}

export default function CategoryPage() {
    const params = useParams()
    const [categoryData, setCategoryData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filteredItems, setFilteredItems] = useState([])

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "content", "menu"), (doc) => {
            if (!doc.exists()) {
                setLoading(false)
                return
            }

            const menuData = doc.data()
            // URL'deki slug'a göre orijinal kategori adını bul
            const originalName = Object.keys(menuData).find(key => 
                createUrlSlug(key) === decodeURIComponent(params.id)
            )

            if (!originalName) {
                setLoading(false)
                return
            }

            const items = menuData[originalName] || []
            const categoryInfo = {
                id: params.id,
                name: originalName,
                items: items
            }
            
            setCategoryData(categoryInfo)
            setFilteredItems(items)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [params.id])

    useEffect(() => {
        if (!categoryData) return

        if (searchTerm.trim() === "") {
            setFilteredItems(categoryData.items)
            return
        }

        const normalizedSearch = searchTerm.toLowerCase()
        const filtered = categoryData.items.filter(item => 
            item.name.toLowerCase().includes(normalizedSearch) ||
            item.description?.toLowerCase().includes(normalizedSearch)
        )
        setFilteredItems(filtered)
    }, [searchTerm, categoryData])

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (!categoryData) {
        return (
            <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-medium text-white mb-4">Kategori bulunamadı</h1>
                    <Link href="/" className="text-amber-500 hover:text-amber-400 inline-flex items-center">
                        Ana Sayfa
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-900">
            <div className="container-custom px-4 py-6 md:py-12">
                {/* Back Button */}
                <div className="mb-6 flex justify-end">
                    <Link
                        href="/"
                        className="text-amber-500 hover:text-amber-400 inline-flex items-center text-base md:text-lg lg:text-xl font-medium px-5 py-2.5 rounded-lg hover:bg-zinc-800/50 transition-all"
                    >
                        ← Ana Sayfa
                    </Link>
                </div>

                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-amber-500">{categoryData.name}</h1>
                    <div className="h-1 w-12 md:w-16 bg-amber-500 rounded-full mt-2 md:mt-4"></div>
                </div>

                <div className="mb-6">
                    <div className="relative w-full md:max-w-md">
                        <input
                            type="text"
                            placeholder="Bu kategoride ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-950 text-white rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm md:text-base"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-zinc-400 text-sm md:text-base">Aradığınız kriterlere uygun ürün bulunamadı.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-neutral-950 backdrop-blur-sm rounded-lg p-4 transition-all shadow-lg relative"
                            >
                                <div className="absolute inset-[5px] border-2 border-amber-500 rounded-lg pointer-events-none"></div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-italic text-white mb-1">{item.name}</h3>
                                        {item.description && (
                                            <p className="text-sm text-zinc-300 italic">{item.description}</p>
                                        )}
                                    </div>
                                    <div className="flex justify-end">
                                        <p className="text-amber-400 font-semibold text-lg md:text-xl bg-neutral-950 px-4 py-2 rounded-full shadow-lg whitespace-nowrap">
                                            {item.price} ₺
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 