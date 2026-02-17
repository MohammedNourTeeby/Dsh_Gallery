import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './lib/session';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log('✅ Middleware executed for path:', pathname);

    // السماح لصفحة الدخول و API الدخول
    if (pathname === '/admin/login' || pathname === '/api/admin/login') {
        console.log('➡️ مسموح: صفحة الدخول');
        return NextResponse.next();
    }

    // حماية جميع مسارات /admin
    if (pathname.startsWith('/admin')) {
        console.log('🔒 مسار محمي:', pathname);

        // 1. التحقق من وجود الكوكي
        const sessionToken = request.cookies.get('admin_session')?.value;
        console.log('🍪 الكوكي موجودة؟', sessionToken ? 'نعم' : 'لا');

        if (!sessionToken) {
            console.log('⚠️ لا توجد كوكي، جاري التوجيه إلى تسجيل الدخول');
            return redirectToLogin(request);
        }

        // 2. التحقق من صحة الكوكي
        try {
            const isValid = await verifySessionToken(sessionToken);
            console.log('🔑 صلاحية الكوكي:', isValid ? 'صالحة' : 'غير صالحة');

            if (!isValid) {
                console.log('⚠️ الكوكي غير صالحة، جاري التوجيه');
                return redirectToLogin(request);
            }
        } catch (error) {
            console.error('❌ خطأ في التحقق من الجلسة:', error);
            return redirectToLogin(request);
        }
    }

    console.log('✅ تمرير الطلب');
    return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    console.log('🔄 إعادة توجيه إلى:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: '/admin/:path*',
};