'use server';

import { db } from '@/lib/db';
import { contactInfo, NewContactInfo } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// دالة التحقق من المدير
async function verifyAdmin() {
    const sessionToken = (await cookies()).get('admin_session')?.value;
    if (!sessionToken) throw new Error('غير مصرح');
    const isValid = await verifySessionToken(sessionToken);
    if (!isValid) throw new Error('غير مصرح');
}

// جلب معلومات الاتصال (للواجهة العامة)
export async function getContactInfo() {
    try {
        const info = await db.select().from(contactInfo).limit(1);
        return info[0] || null;
    } catch (error) {
        console.error('خطأ في جلب معلومات الاتصال:', error);
        return null;
    }
}

// تحديث معلومات الاتصال (للمدير فقط)
export async function updateContactInfo(data: Partial<NewContactInfo>) {
    await verifyAdmin();

    try {
        // إزالة الحقول ذات القيمة undefined من البيانات
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        // التحقق من وجود سجل مسبق
        const existing = await db.select().from(contactInfo).limit(1);

        if (existing.length > 0) {
            // تحديث السجل الموجود
            const [updated] = await db.update(contactInfo)
                .set({ ...cleanData, updatedAt: new Date() })
                .where(eq(contactInfo.id, existing[0].id))
                .returning();
            revalidatePath('/admin/contact');
            return updated;
        } else {
            // إنشاء سجل جديد
            const [created] = await db.insert(contactInfo)
                .values({ ...cleanData, createdAt: new Date(), updatedAt: new Date() })
                .returning();
            revalidatePath('/admin/contact');
            return created;
        }
    } catch (error) {
        console.error('خطأ في تحديث معلومات الاتصال:', error);
        throw new Error('فشل تحديث معلومات الاتصال');
    }
}