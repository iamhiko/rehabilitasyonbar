'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    document.cookie = `auth-token=${token}; path=/`;
                    router.push('/admin');
                } catch (error) {
                    console.error('Error getting token:', error);
                    setError('Oturum başlatılırken bir hata oluştu.');
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                const token = await user.getIdToken();
                document.cookie = `auth-token=${token}; path=/`;
                router.push('/admin');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code === 'auth/invalid-credential') {
                setError('Geçersiz email veya şifre.');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin.');
            } else {
                setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-900 px-4">
            <div className="w-[360px] p-6 bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700">
                <div className="mb-6">
                    <h2 className="text-center text-2xl font-semibold text-white">
                        Giriş Yap
                    </h2>
                </div>
                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Email adresi
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled={isLoading}
                                style={{ backgroundColor: 'white', color: 'black' }}
                                className="appearance-none relative block w-full px-4 py-2.5 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-bold disabled:opacity-50"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1.5">
                                Şifre
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                style={{ backgroundColor: 'white', color: 'black' }}
                                className="appearance-none relative block w-full px-4 py-2.5 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-bold disabled:opacity-50"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 