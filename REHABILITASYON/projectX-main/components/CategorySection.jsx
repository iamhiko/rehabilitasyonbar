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
    'Kokteyller': '/category-images/kokteyl.jpg',
    'Şişe Menüler': '/category-images/sise-menuler.jpg',
    'Biralar': '/category-images/bira.jpg',
    'Importlar': '/category-images/importlar.webp',
    'Shotlar': '/category-images/shot.jpg',
    'Aperatifler': '/category-images/aperatifler.jpg',
    'Alkolsüz İçecekler': '/category-images/alkolsüziçecekler.jpg'
  }

  return imageMap[categoryId] || '/placeholder.svg'
}

export default function CategorySection({ menu = {} }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Tüm kategorileri düzenle ve sırala
    const categoriesList = Object.entries(menu).map(([id, items]) => {
      return {
        id,
        name: id,
        description: `${items?.length || 0} ürün`,
        items: items || [],
        image: getCategoryImage(id),
        order: categoryOrder.indexOf(id)
      }
    }).sort((a, b) => {
      // Eğer kategori listede yoksa en sona at
      if (a.order === -1) return 1
      if (b.order === -1) return -1
      return a.order - b.order
    })

    setCategories(categoriesList)
  }, [menu])

  return (
    <section id="categories" className="py-8 md:py-16">
      <div className="container-custom">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-medium text-white">Kategoriler</h2>
        </div>

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
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
                  className="object-cover transition-transform group-hover:scale-105"
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
