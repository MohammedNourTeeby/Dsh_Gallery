import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    // cookies() is async in Next.js 15, so we must await it
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    return NextResponse.json({ success: true });
}