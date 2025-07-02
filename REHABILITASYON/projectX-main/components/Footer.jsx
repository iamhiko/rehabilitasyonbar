import Link from "next/link"
import { Instagram } from "lucide-react"
import { MapPin, Phone, Music } from "lucide-react"

export default function Footer({ contactInfo }) {
  return (
    <footer className="bg-neutral-950 py-4 md:py-8">
      <div className="container-custom px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div id="contact" className="text-left md:text-center">
            <h3 className="text-lg font-medium text-amber-500 mb-2 md:mb-3">İletişim</h3>
            <div className="space-y-1.5 md:space-y-2 inline-flex flex-col items-start">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-zinc-300 text-sm text-left">{contactInfo?.address}</p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-zinc-300 text-sm text-left">{contactInfo?.phone}</p>
              </div>
            </div>
          </div>

          <div className="text-left md:text-center">
            <h3 className="text-lg font-medium text-amber-500 mb-2 md:mb-3">Canlı Müzik</h3>
            <div className="space-y-1.5 md:space-y-2 inline-flex flex-col items-start">
              <div className="flex items-start">
                <Music className="w-4 h-4 text-amber-500 mt-1 mr-2 flex-shrink-0" />
                <p className="text-zinc-300 text-sm text-left">
                  Yaz boyunca hergün 21:30-01:30 arası
                  <br />  
                  Düzkontak sahnede!
                  <br />
        
                </p>
              </div>
            </div>
          </div>

          <div className="text-left md:text-center">
            <h3 className="text-lg font-medium text-amber-500 mb-2 md:mb-3">Sosyal Medya</h3>
            <div className="flex items-center justify-start md:justify-center">
              <Link 
                href="https://www.instagram.com/rehabilitasyon_bar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-amber-500 transition-colors flex items-center gap-2"
              >
                <Instagram className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-zinc-700 text-center">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Rehabilitasyon Bar. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
