// app/products/page.tsx
import { getPublicProducts } from '@/app/actions/products';
import { ProductCard } from '@/components/admin/ProductCard';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const products = await getPublicProducts();

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-transparent to-pink-50/30 dark:from-indigo-950/20 dark:via-transparent dark:to-pink-950/20">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* رأس الصفحة المتحرك */}
                <div className="relative mb-12">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                    <div className="flex flex-col items-center text-center">
                        {/* أيقونة العنوان */}
                        <div className="mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 p-3 shadow-lg">
                            <Package className="h-8 w-8 text-white" />
                        </div>

                        {/* العنوان مع تأثير متدرج متحرك */}
                        <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
                            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                                جميع المنتجات
                            </span>
                        </h1>

                        {/* إحصائية عدد المنتجات */}
                        <p className="mt-2 text-lg text-muted-foreground">
                            استعرض مجموعتنا الفنية المميزة
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                {products.length} {products.length === 1 ? 'قطعة فنية' : 'قطع فنية'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* عرض المنتجات */}
                {products.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/50 p-16 text-center backdrop-blur-sm dark:border-indigo-800 dark:bg-gray-900/50">
                        <Package className="mx-auto h-16 w-16 text-indigo-300 dark:text-indigo-700" />
                        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            لا توجد منتجات حالياً
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            سنضيف منتجات جديدة قريباً، تفضل بزيارتنا لاحقاً
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <ArrowRight className="h-4 w-4" />
                            العودة للرئيسية
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* شبكة المنتجات مع تأثير ظهور متتابع */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="animate-fade-in-up"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <ProductCard product={product} showActions={false} />
                                </div>
                            ))}
                        </div>

                        {/* زر العودة للرئيسية (اختياري) */}
                        <div className="mt-12 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/50 px-6 py-3 text-indigo-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-gray-900/50 dark:text-indigo-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950"
                            >
                                <ArrowRight className="h-4 w-4" />
                                العودة إلى الرئيسية
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}