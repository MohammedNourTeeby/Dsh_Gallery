import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSessionToken } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();

        // تحقق من كلمة المرور
        if (password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json({ message: 'كلمة المرور غير صحيحة' }, { status: 401 });
        }

        // إنشاء توكن الجلسة
        const token = await createSessionToken();

        // تخزين التوكن في httpOnly cookie
        (await
            // تخزين التوكن في httpOnly cookie
            cookies()).set('admin_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 ساعة
                path: '/',
            });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ message: 'خطأ داخلي' }, { status: 500 });
    }
}