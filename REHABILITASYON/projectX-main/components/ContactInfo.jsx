import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactInfo({ address, phone, email, workingHours }) {
  return (
    <section id="contact" className="section bg-zinc-900">
      <div className="container-custom">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-amber-500">İletişim</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="bg-zinc-800 p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-amber-400">İletişim Bilgileri</h3>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 mr-3" />
                <p className="text-sm md:text-base text-zinc-300">
                  {address || "Örnek Mahallesi, Bar Caddesi No:123\nMerkez / İstanbul"}
                </p>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-amber-500 mr-3" />
                <p className="text-sm md:text-base text-zinc-300">{phone || "+90 212 123 45 67"}</p>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 text-amber-500 mr-3" />
                <p className="text-sm md:text-base text-zinc-300">{email || "info@modernbar.com"}</p>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 text-amber-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm md:text-base text-zinc-300">
                    {workingHours?.mondayToThursday || "Pazartesi - Perşembe: 16:00 - 01:00"}
                  </p>
                  <p className="text-sm md:text-base text-zinc-300">
                    {workingHours?.fridayToSaturday || "Cuma - Cumartesi: 16:00 - 03:00"}
                  </p>
                  <p className="text-sm md:text-base text-zinc-300">
                    {workingHours?.sunday || "Pazar: 16:00 - 00:00"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-4 md:p-6 rounded-lg shadow-lg h-full">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-amber-400">Konum</h3>
            <div className="w-full h-48 md:h-80 bg-zinc-700 rounded-lg overflow-hidden">
              {/* Map would be integrated here */}
              <div className="w-full h-full bg-zinc-600 rounded flex items-center justify-center">
                <p className="text-zinc-400">Harita Görünümü</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
