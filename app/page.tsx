// app/page.tsx
import { getPublicProducts } from '@/app/actions/products';
import { ProductCard } from '@/components/admin/ProductCard';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default async function Home() {
  const products = await getPublicProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 via-transparent to-pink-50/50 dark:from-indigo-950/30 dark:via-transparent dark:to-pink-950/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* قسم الترحيب المتحرك */}
        <div className="relative mb-12 text-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <h1 className="relative mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              مرحبًا بك في معرض DSH
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            استعرض مجموعتنا الفنية المميزة من اللوحات والتماثيل والأعمال الإبداعية
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
            <span className="text-sm text-indigo-600 dark:text-indigo-400">
              {products.length} {products.length === 1 ? 'قطعة فنية' : 'قطع فنية'} متاحة
            </span>
          </div>
        </div>

        {/* عرض المنتجات */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/50 p-12 text-center backdrop-blur-sm dark:border-indigo-800 dark:bg-gray-900/50">
            <p className="text-xl text-muted-foreground">لا توجد منتجات متاحة حالياً.</p>
            <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
              سيتم إضافة منتجات قريباً...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} showActions={false} />
              </div>
            ))}
          </div>
        )}

        {/* رابط تصفح المزيد (اختياري) */}
        {products.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
            >
              <span>عرض جميع المنتجات</span>
              <ArrowLeft className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}