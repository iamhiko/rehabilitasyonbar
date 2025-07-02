"use client"

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc, deleteDoc, setDoc } from 'firebase/firestore'
import { Pencil, Trash, Save, X, Plus, Menu } from 'lucide-react'

export default function MenuPage() {
    const [categories, setCategories] = useState({})
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [editingItem, setEditingItem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "content", "menu"), (doc) => {
            if (doc.exists()) {
                setCategories(doc.data())
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleSaveItem = async (categoryId, item) => {
        try {
            const menuRef = doc(db, "content", "menu")
            const updatedItems = categories[categoryId].map(i => 
                i.id === item.id ? item : i
            )
            
            await updateDoc(menuRef, {
                [categoryId]: updatedItems
            })
            setEditingItem(null)
        } catch (error) {
            console.error("Error saving item:", error)
            alert("Ürün kaydedilirken bir hata oluştu.")
        }
    }

    const handleDeleteItem = async (categoryId, itemId) => {
        if (!window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return

        try {
            const menuRef = doc(db, "content", "menu")
            const updatedItems = categories[categoryId].filter(i => i.id !== itemId)
            
            await updateDoc(menuRef, {
                [categoryId]: updatedItems
            })
        } catch (error) {
            console.error("Error deleting item:", error)
            alert("Ürün silinirken bir hata oluştu.")
        }
    }

    const handleAddItem = async (categoryId) => {
        try {
            const menuRef = doc(db, "content", "menu")
            const newItem = {
                id: Date.now().toString(),
                name: "Yeni Ürün",
                price: "0",
                description: ""
            }
            
            const updatedItems = [...categories[categoryId], newItem]
            await updateDoc(menuRef, {
                [categoryId]: updatedItems
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

    return (
        <div className="flex h-full relative">
            {/* Category Sidebar */}
            <div className="w-48 bg-zinc-800 min-h-[calc(100vh-4rem)] border-r border-zinc-700">
                <div className="p-4">
                    <h2 className="text-lg font-bold text-white mb-4">Kategoriler</h2>
                    <nav className="space-y-1">
                        {Object.keys(categories).map((categoryId) => (
                            <button
                                key={categoryId}
                                onClick={() => setSelectedCategory(categoryId)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-lg transition-colors text-sm
                                    ${selectedCategory === categoryId 
                                        ? 'bg-amber-500 text-white' 
                                        : 'text-white hover:bg-zinc-700'}
                                `}
                            >
                                {categoryId}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {selectedCategory ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">{selectedCategory}</h2>
                            <button
                                onClick={() => handleAddItem(selectedCategory)}
                                className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Yeni Ürün</span>
                            </button>
                        </div>

                        <div className="grid gap-4">
                            {categories[selectedCategory].map((item) => (
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
                                                    onClick={() => handleSaveItem(selectedCategory, editingItem)}
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
                                                    onClick={() => handleDeleteItem(selectedCategory, item.id)}
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
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-zinc-400">Lütfen soldaki menüden bir kategori seçin</p>
                    </div>
                )}
            </div>
        </div>
    )
} 