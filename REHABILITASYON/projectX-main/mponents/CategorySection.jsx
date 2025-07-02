"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

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

// Kategori sıralaması
const categoryOrder = [
  'Biralar',
  'Shotlar',
  'Importlar',
  'Kokteyller',
  'Şişe Menüler',
  'Alkolsüz İçecekler',
  'Aperatifler'
]

// Kategori görsel eşleştirmeleri
const getCategoryImage = (categoryId) => {
  const imageMap = {
    'Biralar': '/category-images/bira.jpg',
    'Shotlar': '/category-images/shot.jpg',
    'Importlar': '/category-images/importlar.webp',
    'Kokteyller': '/category-images/kokteyl.jpg',
    'Şişe Menüler': '/category-images/sise-menuler.jpg',
    'Alkolsüz İçecekler': '/category-images/alkolsüziçecekler.jpg',
    'Aperatifler': '/category-images/aperatifler.jpg'
  }

  return imageMap[categoryId] || '/placeholder.svg'
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export default function CategorySection({ menu = {} }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    console.log('Firebase Menu Data:', menu)
    console.log('Category Order:', categoryOrder)
    
    // Önce categoryOrder'daki tüm kategorileri oluştur
    const orderedCategories = categoryOrder.map(categoryName => {
      const items = menu[categoryName] || []
      return {
        id: categoryName,
        name: categoryName,
        description: `${items.length} ürün`,
        items: items,
        image: getCategoryImage(categoryName),
        order: categoryOrder.indexOf(categoryName)
      }
    })

    console.log('Ordered Categories:', orderedCategories)

    // Eğer menu'de categoryOrder'da olmayan kategoriler varsa, onları da ekle
    const additionalCategories = Object.entries(menu)
      .filter(([id]) => !categoryOrder.includes(id))
      .map(([id, items]) => ({
        id,
        name: id,
        description: `${items?.length || 0} ürün`,
        items: items || [],
        image: getCategoryImage(id),
        order: categoryOrder.length // En sona ekle
      }))

    console.log('Additional Categories:', additionalCategories)
    console.log('Final Categories:', [...orderedCategories, ...additionalCategories])

    setCategories([...orderedCategories, ...additionalCategories])
  }, [menu])

  return (
    <section id="categories" className="py-8 md:py-16">
      <div className="container-custom">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-white">Kategoriler</h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${createUrlSlug(category.id)}`}
                className="group relative h-32 md:h-56 rounded-lg overflow-hidden bg-neutral-950"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className={`object-contain transition-transform group-hover:scale-105 ${
                    category.id === 'Şişe Menüler' ? 'object-[center_20%]' : ''
                  }`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw"
                  priority={true}
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-base md:text-xl font-medium text-white mb-0.5 md:mb-1">{category.name}</h3>
                  <p className="text-xs md:text-sm text-zinc-300">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 