import Image from "next/image"

export default function VenueGallery({ images = [] }) {
  return (
    <section className="section bg-zinc-900">
      <div className="container-custom">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-amber-500">Mekanımız</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative h-36 md:h-64 rounded-lg overflow-hidden">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt || "Mekan görseli"}
                fill
                className="object-cover hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
