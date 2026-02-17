'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, LogIn, AlertCircle } from 'lucide-react';

// مكون منفصل يستخدم useSearchParams()
function LoginForm() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin/products';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                window.location.href = callbackUrl;
            } else {
                const data = await res.json();
                setError(data.message || 'فشل تسجيل الدخول');
            }
        } catch {
            setError('حدث خطأ في الاتصال');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    كلمة المرور
                </label>
                <div className="relative">
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus
                        className="h-12 pr-10 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                    />
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-400" />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            <Button
                type="submit"
                className="relative h-12 w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25 disabled:opacity-70"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <svg className="ml-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        جاري التحقق...
                    </>
                ) : (
                    <>
                        <LogIn className="ml-2 h-4 w-4 inline-block" />
                        دخول
                    </>
                )}
            </Button>
        </form>
    );
}

export default function AdminLoginPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
            {/* الخلفية المتحركة (كما هي) */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-indigo-400/30 blur-3xl animate-blob" />
                <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-pink-400/30 blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-0 left-1/2 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl animate-blob animation-delay-4000" />
            </div>

            <div className="w-full max-w-md px-4 animate-fade-in-up">
                <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-2xl dark:bg-gray-900/70">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 shadow-lg">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                            دخول المدير
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            أدخل كلمة المرور للوصول إلى لوحة التحكم
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* تغليف الجزء الذي يستخدم useSearchParams بـ Suspense */}
                        <Suspense fallback={<div className="text-center py-4">جاري التحميل...</div>}>
                            <LoginForm />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}