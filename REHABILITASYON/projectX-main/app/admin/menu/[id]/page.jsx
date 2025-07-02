"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Pencil, Trash, Save, X, Plus } from 'lucide-react'
import Link from 'next/link'

// Kategori mapping'i
const categoryMapping = {
    'sise-menuler': 'Şişe Menüler',
    'alkolsuz-icecekler': 'Alkolsüz İçecekler',
    'biralar': 'Biralar',
    'kokteyller': 'Kokteyller',
    'importlar': 'Importlar',
    'shotlar': 'Shotlar'
}

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
    const [categoryData, setCategoryData] = useState([])
    const [editingItem, setEditingItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [categoryName, setCategoryName] = useState("")

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "content", "menu"), (doc) => {
            if (doc.exists()) {
                const data = doc.data()
                // URL'deki slug'a göre orijinal kategori adını bul
                const originalName = Object.keys(data).find(key => 
                    createUrlSlug(key).toLowerCase() === decodeURIComponent(params.id).toLowerCase()
                )
                
                if (originalName) {
                    setCategoryName(originalName)
                    setCategoryData(data[originalName] || [])
                }
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [params.id])

    const handleSaveItem = async (item) => {
        try {
            const menuRef = doc(db, "content", "menu")
            const updatedItems = categoryData.map(i => 
                i.id === item.id ? item : i
            )
            
            await updateDoc(menuRef, {
                [categoryName]: updatedItems
            })
            setEditingItem(null)
        } catch (error) {
            console.error("Error saving item:", error)
            alert("Ürün kaydedilirken bir hata oluştu.")
        }
    }

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return

        try {
            const menuRef = doc(db, "content", "menu")
            const updatedItems = categoryData.filter(i => i.id !== itemId)
            
            await updateDoc(menuRef, {
                [categoryName]: updatedItems
            })
        } catch (error) {
            console.error("Error deleting item:", error)
            alert("Ürün silinirken bir hata oluştu.")
        }
    }

    const handleAddItem = async () => {
        try {
            const menuRef = doc(db, "content", "menu")
            const newItem = {
                id: Date.now().toString(),
                name: "Yeni Ürün",
                price: "0",
                description: ""
            }
            
            const updatedItems = [...categoryData, newItem]
            await updateDoc(menuRef, {
                [categoryName]: updatedItems
            })
            setEditingItem(newItem)
        } catch (error) {
            console.error("Error adding item:", error)
            alert("Yeni ürün eklenirken bir hata oluştu.")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    if (!categoryName) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-medium text-white mb-4">Kategori bulunamadı</h1>
                    <Link href="/admin" className="text-amber-500 hover:text-amber-400">
                        Admin Paneline Dön
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Category Header */}
            <div className="mb-8 border-b border-zinc-700 pb-4">
                <h1 className="text-3xl font-bold text-amber-500">{categoryName}</h1>
            </div>

            {/* Content */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium text-white">Ürünler</h2>
                <button
                    onClick={handleAddItem}
                    className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Yeni Ürün</span>
                </button>
            </div>

            <div className="grid gap-4">
                {categoryData.map((item) => (
                    <div key={item.id} className="bg-zinc-800 rounded-lg p-4">
                        {editingItem?.id === item.id ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                    className="w-full bg-zinc-700 text-white px-3 py-2 rounded-lg"
                                    placeholder="Ürün adı"
                                />
                                <textarea
                                    value={editingItem.description || ""}
                                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                                    className="w-full bg-zinc-700 text-white px-3 py-2 rounded-lg"
                                    placeholder="Ürün açıklaması"
                                    rows="2"
                                />
                                <input
                                    type="text"
                                    value={editingItem.price}
                                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                                    className="w-full bg-zinc-700 text-white px-3 py-2 rounded-lg"
                                    placeholder="Fiyat"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleSaveItem(editingItem)}
                                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Kaydet</span>
                                    </button>
                                    <button
                                        onClick={() => setEditingItem(null)}
                                        className="flex items-center space-x-2 bg-zinc-600 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>İptal</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{item.name}</h3>
                                    {item.description && (
                                        <p className="text-zinc-400 mt-1">{item.description}</p>
                                    )}
                                    <p className="text-amber-500 font-medium mt-2">{item.price} ₺</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="p-2 text-white hover:bg-zinc-700 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="p-2 text-red-500 hover:bg-zinc-700 rounded-lg transition-colors"
                                    >
                                        <Trash className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
} 