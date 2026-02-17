// app/actions/products.ts
'use server';

import { db } from '@/lib/db';
import { products, NewProduct } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
    const sessionToken = (await cookies()).get('admin_session')?.value;
    if (!sessionToken) throw new Error('غير مصرح');
    const isValid = await verifySessionToken(sessionToken);
    if (!isValid) throw new Error('غير مصرح');
}

export async function getProducts() {
    await verifyAdmin();
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    return allProducts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }));
}

export async function addProduct(productData: Omit<NewProduct, 'id' | 'createdAt'>) {
    await verifyAdmin();
    try {
        const [newProduct] = await db.insert(products).values({
            ...productData,
            createdAt: new Date(),
        }).returning();

        // تحويل createdAt إلى نص
        const serialized = {
            ...newProduct,
            createdAt: newProduct.createdAt.toISOString(),
        };

        revalidatePath('/admin/products');
        return serialized;
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        throw new Error('فشل في إضافة المنتج');
    }
}

export async function updateProduct(id: number, productData: Partial<NewProduct>) {
    await verifyAdmin();
    try {
        const [updatedProduct] = await db.update(products)
            .set(productData)
            .where(eq(products.id, id))
            .returning();

        const serialized = {
            ...updatedProduct,
            createdAt: updatedProduct.createdAt.toISOString(),
        };

        revalidatePath('/admin/products');
        return serialized;
    } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        throw new Error('فشل في تحديث المنتج');
    }
}

export async function deleteProduct(id: number) {
    await verifyAdmin();
    try {
        await db.delete(products).where(eq(products.id, id));
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        throw new Error('فشل في حذف المنتج');
    }

}
// دالة عامة لجلب المنتجات (لجميع الزوار)
export async function getPublicProducts() {
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        return allProducts.map(p => ({ ...p, createdAt: p.createdAt.toISOString() }));
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return [];
    }
}