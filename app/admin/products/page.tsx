import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { Package } from "lucide-react";

export default async function AdminProductsPage() {
    // جلب المنتجات من قاعدة البيانات PostgreSQL
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));

    // تحويل التواريخ إلى نصوص لتجنب مشاكل serialization
    const serializedProducts = allProducts.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
    }));

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-transparent to-pink-50/30 dark:from-indigo-950/20 dark:via-transparent dark:to-pink-950/20">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* رأس الصفحة المتحرك */}
                <div className="relative mb-12 text-center">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                    <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 p-3 shadow-lg">
                        <Package className="h-8 w-8 text-white" />
                    </div>

                    <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                            إدارة المنتجات
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        قم بإضافة وتعديل وحذف المنتجات في معرضك الفني
                    </p>
                </div>

                {/* مكون إدارة المنتجات */}
                <ProductManagement initialProducts={serializedProducts} />
            </div>
        </div>
    );
} 