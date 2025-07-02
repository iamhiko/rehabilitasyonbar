"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function withAuth(Component) {
    return function ProtectedRoute({ ...props }) {
        const router = useRouter()
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (!user) {
                    // Redirect to login if not authenticated
                    router.replace('/login')
                } else {
                    // Check if user is admin (you can add additional checks here)
                    setLoading(false)
                }
            })

            return () => unsubscribe()
        }, [router])

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-zinc-900">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
            )
        }

        return <Component {...props} />
    }
} 