'use server';

import { db } from '@/lib/db';
import { contactInfo, NewContactInfo } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
    const sessionToken = (await cookies()).get('admin_session')?.value;
    if (!sessionToken) throw new Error('غير مصرح');
    const isValid = await verifySessionToken(sessionToken);
    if (!isValid) throw new Error('غير مصرح');
}

export async function getContactInfo() {
    try {
        const info = await db.select().from(contactInfo).limit(1);
        return info[0] || null;
    } catch (error) {
        console.error('خطأ في جلب معلومات الاتصال:', error);
        return null;
    }
}

export async function updateContactInfo(data: Partial<NewContactInfo>) {
    await verifyAdmin();

    try {
        // التحقق من وجود سجل مسبق
        const existing = await db.select().from(contactInfo).limit(1);

        if (existing.length > 0) {
            // تحديث السجل الموجود: نأخذ فقط الحقول التي تم إرسالها (غير undefined)
            const updateData: Partial<NewContactInfo> = {};
            for (const [key, value] of Object.entries(data)) {
                if (value !== undefined) {
                    // استخدام any هنا لتجنب مشاكل TypeScript لأن key قد يكون من type string
                    (updateData as any)[key] = value;
                }
            }
            // نضيف updatedAt
            const [updated] = await db.update(contactInfo)
                .set({ ...updateData, updatedAt: new Date() })
                .where(eq(contactInfo.id, existing[0].id))
                .returning();
            revalidatePath('/admin/contact');
            return updated;
        } else {
            // إنشاء سجل جديد: يجب توفير جميع الحقول المطلوبة (phone, email, address)
            const insertData: NewContactInfo = {
                phone: data.phone ?? '',          // قيمة افتراضية إذا لم تقدم
                email: data.email ?? '',          // قيمة افتراضية
                address: data.address ?? '',      // قيمة افتراضية
                facebook: data.facebook ?? null,  // اختياري
                instagram: data.instagram ?? null,
                twitter: data.twitter ?? null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const [created] = await db.insert(contactInfo)
                .values(insertData)
                .returning();
            revalidatePath('/admin/contact');
            return created;
        }
    } catch (error) {
        console.error('خطأ في تحديث معلومات الاتصال:', error);
        throw new Error('فشل تحديث معلومات الاتصال');
    }
}