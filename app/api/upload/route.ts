import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// تكوين Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'لم يتم رفع أي ملف' }, { status: 400 });
        }

        // تحويل الملف إلى ArrayBuffer ثم إلى Base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // رفع الصورة إلى Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'gallery', resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        // إرجاع رابط الصورة
        return NextResponse.json({ url: (result as any).secure_url });
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        return NextResponse.json({ error: 'فشل رفع الصورة' }, { status: 500 });
    }
}