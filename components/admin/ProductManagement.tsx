'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog';
import { Plus, Loader2, Package, AlertCircle } from 'lucide-react';
import { addProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import { ProductCard } from './ProductCard';
import { toast } from 'sonner';

// دالة للتحقق من صحة الرابط (مكررة للاستخدام)
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// واجهة المنتج (نقوم بتصديرها لاستخدامها في ProductCard)
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string | null;
    specifications?: any;
    createdAt?: string;
}

interface ProductManagementProps {
    initialProducts: Product[];
}

export function ProductManagement({ initialProducts }: ProductManagementProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'فشل رفع الصورة');
        }

        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const file = formData.get('image') as File;
        let imageUrl = editingProduct?.imageUrl || '';

        try {
            setIsUploading(true);

            if (file && file.size > 0) {
                imageUrl = await uploadImage(file);
            }

            const productData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                category: formData.get('category') as string,
                imageUrl,
            };

            if (editingProduct) {
                // تحديث منتج موجود
                const updated = await updateProduct(editingProduct.id, productData);
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
                toast.success('تم تحديث المنتج بنجاح', {
                    style: { background: 'linear-gradient(to right, #4f46e5, #db2777)', color: 'white' }
                });
            } else {
                // إضافة منتج جديد
                const newProduct = await addProduct(productData);
                setProducts(prev => [newProduct, ...prev]);
                toast.success('تم إضافة المنتج بنجاح', {
                    style: { background: 'linear-gradient(to right, #4f46e5, #db2777)', color: 'white' }
                });
            }

            setIsDialogOpen(false);
            setEditingProduct(null);
            router.refresh(); // مزامنة مع الخادم
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ المنتج', {
                style: { background: '#ef4444', color: 'white' }
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            try {
                await deleteProduct(id);
                setProducts(prev => prev.filter(p => p.id !== id));
                toast.success('تم حذف المنتج بنجاح', {
                    style: { background: 'linear-gradient(to right, #4f46e5, #db2777)', color: 'white' }
                });
                router.refresh();
            } catch (error) {
                toast.error('حدث خطأ أثناء حذف المنتج', {
                    style: { background: '#ef4444', color: 'white' }
                });
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* رأس الصفحة مع زر الإضافة */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                        المنتجات ({products.length})
                    </h2>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => setEditingProduct(null)}
                            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/25"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Plus className="ml-2 h-4 w-4 inline-block" />
                            إضافة منتج جديد
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 bg-gradient-to-b from-white to-indigo-50/50 backdrop-blur-sm dark:from-gray-900 dark:to-indigo-950/30">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                                {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                قم بإدخال بيانات المنتج ورفع صورة له. جميع الحقول مطلوبة ما لم يذكر خلاف ذلك.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    اسم المنتج <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="أدخل اسم المنتج"
                                    defaultValue={editingProduct?.name}
                                    required
                                    className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    الوصف <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="أدخل وصف المنتج"
                                    defaultValue={editingProduct?.description}
                                    required
                                    rows={3}
                                    className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        السعر <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        defaultValue={editingProduct?.price}
                                        required
                                        className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        التصنيف <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="category"
                                        name="category"
                                        placeholder="مثال: لوحات، تماثيل..."
                                        defaultValue={editingProduct?.category}
                                        required
                                        className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    صورة المنتج
                                </label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="border-indigo-200 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:border-indigo-800 dark:file:bg-indigo-950 dark:file:text-indigo-300"
                                />
                                {editingProduct?.imageUrl && isValidUrl(editingProduct.imageUrl) && (
                                    <div className="mt-2 relative w-40 h-40 border-2 border-indigo-200 rounded-lg overflow-hidden shadow-md">
                                        <img
                                            src={editingProduct.imageUrl}
                                            alt={editingProduct.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                        جاري رفع الصورة...
                                    </>
                                ) : (
                                    'حفظ'
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* عرض المنتجات كبطاقات */}
            {products.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-br from-white/50 to-indigo-50/50 p-16 text-center backdrop-blur-sm dark:border-indigo-800 dark:from-gray-900/50 dark:to-indigo-950/30">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 animate-pulse" />
                    <AlertCircle className="mx-auto h-16 w-16 text-indigo-300 dark:text-indigo-700" />
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">لا توجد منتجات بعد</h3>
                    <p className="mt-2 text-muted-foreground">ابدأ بإضافة منتجك الأول الآن</p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setEditingProduct(null);
                            setIsDialogOpen(true);
                        }}
                        className="mt-4 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        <Plus className="ml-2 h-4 w-4" />
                        أضف منتجك الأول
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <ProductCard
                                product={product}
                                onEdit={(product) => {
                                    setEditingProduct(product);
                                    setIsDialogOpen(true);
                                }}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}