import { Playfair_Display, Montserrat, Righteous } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const righteous = Righteous({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-righteous",
})

export const metadata = {
  title: "Rehabilitasyon Bar",
  description: "Premium cocktails and dining experience",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${playfair.variable} ${montserrat.variable} ${righteous.variable} font-sans bg-zinc-900 text-zinc-100`}>
        {children}
      </body>
    </html>
  )
}
