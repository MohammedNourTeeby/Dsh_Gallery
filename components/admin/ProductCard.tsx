'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Pencil, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function isValidUrl(url: string): boolean {
    try { new URL(url); return true; } catch { return false; }
}

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

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    onDelete?: (id: number) => void;
    showActions?: boolean;
}

export function ProductCard({
    product,
    onEdit,
    onDelete,
    showActions = true,
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleEdit = () => onEdit?.(product);
    const handleDelete = () => onDelete?.(product.id);

    return (
        <Card
            className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 dark:from-gray-900/50 dark:to-gray-800/50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* خلفية متدرجة متحركة */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-700 group-hover:opacity-20" />

            {/* شريط علوي متدرج */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

            {/* منطقة الصورة */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-950 dark:to-pink-950">
                {product.imageUrl && isValidUrl(product.imageUrl) ? (
                    <>
                        <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className={`object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 blur-0' : 'scale-110 blur-xl'
                                } group-hover:scale-110`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onLoad={() => setImageLoaded(true)}
                        />
                        {/* تأثير توهج عند التحويم */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''
                            }`} />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Eye className="mx-auto h-12 w-12 text-gray-400" />
                            <span className="mt-2 block text-sm text-gray-400">لا توجد صورة</span>
                        </div>
                    </div>
                )}
            </div>

            <CardContent className="relative p-4">
                {/* عنوان المنتج */}
                <h3 className="mb-1 text-lg font-semibold line-clamp-1 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-pink-500 transition-all duration-300">
                    {product.name}
                </h3>

                {/* وصف المنتج */}
                <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>

                {/* التصنيف والسعر */}
                <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {product.category}
                    </span>
                    <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
                        {product.price} <span className="text-sm">ر.س</span>
                    </span>
                </div>

                {/* خط فاصل متحرك */}
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-indigo-500/0 via-purple-500/50 to-pink-500/0 transform scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
            </CardContent>

            {/* أزرار الإجراءات (تظهر فقط عند الحاجة) */}
            {showActions && (
                <CardFooter className="flex justify-between gap-2 p-4 pt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-indigo-200 bg-white/50 text-indigo-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-800 dark:bg-gray-800/50 dark:text-indigo-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-950"
                        onClick={handleEdit}
                    >
                        <Pencil className="ml-2 h-4 w-4" />
                        تعديل
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 bg-red-500/80 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-red-600 dark:bg-red-700/80 dark:hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}