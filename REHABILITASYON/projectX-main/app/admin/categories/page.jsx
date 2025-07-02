"use client"

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore'
import { Pencil, Trash, Save, X, Plus } from 'lucide-react'

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

export default function CategoriesPage() {
    const [categories, setCategories] = useState({})
    const [editingCategory, setEditingCategory] = useState(null)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "content", "menu"), (doc) => {
            if (doc.exists()) {
                setCategories(doc.data())
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return

        try {
            const menuRef = doc(db, "content", "menu")
            await updateDoc(menuRef, {
                [newCategoryName]: []
            })
            setNewCategoryName("")
        } catch (error) {
            console.error("Error adding category:", error)
            alert("Kategori eklenirken bir hata oluştu.")
        }
    }

    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm("Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve kategorideki tüm ürünler silinecektir.")) return

        try {
            const menuRef = doc(db, "content", "menu")
            const updatedCategories = { ...categories }
            delete updatedCategories[categoryId]
            await setDoc(menuRef, updatedCategories)
        } catch (error) {
            console.error("Error deleting category:", error)
            alert("Kategori silinirken bir hata oluştu.")
        }
    }

    const handleUpdateCategory = async (oldCategoryId, newCategoryId) => {
        if (!newCategoryId.trim() || oldCategoryId === newCategoryId) {
            setEditingCategory(null)
            return
        }

        try {
            const menuRef = doc(db, "content", "menu")
            const updatedCategories = { ...categories }
            updatedCategories[newCategoryId] = categories[oldCategoryId]
            delete updatedCategories[oldCategoryId]
            await setDoc(menuRef, updatedCategories)
            setEditingCategory(null)
        } catch (error) {
            console.error("Error updating category:", error)
            alert("Kategori güncellenirken bir hata oluştu.")
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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-8">Kategori Yönetimi</h1>

            {/* Add New Category */}
            <div className="bg-zinc-800 rounded-lg p-4 mb-8">
                <h2 className="text-lg font-medium text-white mb-4">Yeni Kategori Ekle</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Kategori adı"
                        className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Ekle</span>
                    </button>
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
                {Object.entries(categories).map(([categoryId, items]) => (
                    <div key={categoryId} className="bg-zinc-800 rounded-lg p-4">
                        {editingCategory === categoryId ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    defaultValue={categoryId}
                                    className="flex-1 bg-zinc-700 text-white px-3 py-2 rounded-lg"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUpdateCategory(categoryId, e.target.value)
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => setEditingCategory(null)}
                                    className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-white">{categoryId}</h3>
                                    <p className="text-zinc-400 text-sm">{items.length} ürün</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingCategory(categoryId)}
                                        className="p-2 text-white hover:bg-zinc-700 rounded-lg transition-colors"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(categoryId)}
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