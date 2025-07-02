'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { db, auth } from '@/lib/firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Kategori mapping
const categoryMapping = {
    'sise-menuler': 'Şişe Menüler',
    'alkolsuz-icecekler': 'Alkolsüz İçecekler',
    'biralar': 'Biralar',
    'kokteyller': 'Kokteyller',
    'importlar': 'Importlar',
    'shotlar': 'Shotlar'
}

// Slug dönüştürücüler
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

const getOriginalName = (slug) => {
    return categoryMapping[slug] || slug
}

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [categories, setCategories] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()

    useEffect(() => {
        let isMounted = true

        // Auth kontrolü
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!isMounted) return

            if (!user) {
                console.log('No user found, redirecting to login...')
                window.location.replace('/login')
            } else {
                console.log('User authenticated:', user.email)
                setIsLoading(false)
            }
        })

        // Menü verilerini dinle
        const unsubscribeMenu = onSnapshot(doc(db, 'content', 'menu'), (docSnap) => {
            if (docSnap.exists() && isMounted) {
                setCategories(docSnap.data())
            }
        })

        return () => {
            isMounted = false
            unsubscribeAuth()
            unsubscribeMenu()
        }
    }, [])

    const handleLogout = async () => {
        try {
            // Önce cookie'yi temizle
            document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            // Sonra Firebase'den çıkış yap
            await signOut(auth);
            // En son yönlendir
            window.location.href = '/login';
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-900">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-700">
                    <h1 className="text-xl font-medium text-white">Admin Panel</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className="w-6 h-6 text-zinc-400" />
                    </button>
                </div>
                <nav className="px-4 py-4">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/admin" className={`flex items-center px-4 py-2 text-sm rounded-lg ${pathname === '/admin' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                                <Menu className="w-5 h-5 mr-3" />
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/menu" className={`flex items-center px-4 py-2 text-sm rounded-lg ${pathname === '/admin/menu' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                                <Menu className="w-5 h-5 mr-3" />
                                Menü Yönetimi
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/categories" className={`flex items-center px-4 py-2 text-sm rounded-lg ${pathname === '/admin/categories' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                                <Menu className="w-5 h-5 mr-3" />
                                Kategori Yönetimi
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin/qr" className={`flex items-center px-4 py-2 text-sm rounded-lg ${pathname === '/admin/qr' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}>
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v4m0 0h2m-2 0h-2m6 0h-2m2 0v1m0 0v4m0 0h2m-2 0h-2m-6 0h-2m2 0v1m0 0v4m0 0h2m-2 0h-2m-6 0h-2m2 0v1m0 0v4m0 0h2m-2 0h-2" />
                                </svg>
                                QR Kod Oluşturucu
                            </Link>
                        </li>
                        <li>
                            <Link href="/" className="flex items-center w-full px-4 py-2 text-sm text-amber-500 rounded-lg hover:bg-zinc-700">
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Anasayfaya Dön
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-400 rounded-lg hover:bg-zinc-700">
                                <X className="w-5 h-5 mr-3" />
                                Çıkış Yap
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Ana içerik */}
            <div className="md:pl-64">
                <div className="sticky top-0 z-40 flex items-center h-16 px-4 bg-zinc-800 border-b border-zinc-700 md:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
