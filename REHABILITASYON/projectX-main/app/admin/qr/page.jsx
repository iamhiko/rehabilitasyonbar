'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'

export default function QRGeneratorPage() {
    const [url, setUrl] = useState('')
    const [qrValue, setQrValue] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!url) {
            setError('Lütfen bir URL girin')
            return
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            setError('Lütfen geçerli bir URL girin (http:// veya https:// ile başlamalı)')
            return
        }
        setQrValue(url)
        setError('')
    }

    const downloadQR = () => {
        const svg = document.getElementById('qr-code')
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0)
                const pngUrl = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.href = pngUrl
                downloadLink.download = 'qr-code.png'
                document.body.appendChild(downloadLink)
                downloadLink.click()
                document.body.removeChild(downloadLink)
            }

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <h1 className="text-xl font-medium text-white mb-6">QR Kod Oluşturucu</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-zinc-300 mb-1.5">
                            URL
                        </label>
                        <input
                            type="url"
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
                        />
                        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-colors"
                    >
                        QR Kod Oluştur
                    </button>
                </form>

                {qrValue && (
                    <div className="mt-8 flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg">
                            <QRCodeSVG
                                id="qr-code"
                                value={qrValue}
                                size={256}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <button
                            onClick={downloadQR}
                            className="mt-4 flex items-center px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            QR Kodu İndir
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
} 