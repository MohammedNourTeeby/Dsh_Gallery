import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/session';

export async function GET() {
    try {
        const sessionToken = (await cookies()).get('admin_session')?.value;

        if (!sessionToken) {
            return NextResponse.json({ loggedIn: false });
        }

        const isValid = await verifySessionToken(sessionToken);
        return NextResponse.json({ loggedIn: isValid });
    } catch (error) {
        return NextResponse.json({ loggedIn: false });
    }
}