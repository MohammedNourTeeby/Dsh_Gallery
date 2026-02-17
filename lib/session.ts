import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.SESSION_SECRET!);
const algorithm = 'HS256';

// إنشاء توكن جلسة صالح لمدة 24 ساعة
export async function createSessionToken() {
    return await new SignJWT({ loggedIn: true })
        .setProtectedHeader({ alg: algorithm })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secretKey);
}

// التحقق من صحة التوكن وإرجاع true/false
export async function verifySessionToken(token: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, secretKey, { algorithms: [algorithm] });
        return payload.loggedIn === true;
    } catch {
        return false;
    }
}