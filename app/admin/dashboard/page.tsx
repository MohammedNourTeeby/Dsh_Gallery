import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, Phone } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">إدارة المنتجات</h2>
                    <p className="text-muted-foreground mb-4">إضافة، تعديل، حذف المنتجات</p>
                    <Button asChild>
                        <Link href="/admin/products">
                            <Package className="ml-2 h-4 w-4" />
                            الذهاب إلى المنتجات
                        </Link>
                    </Button>
                </div>
                <div className="p-6 bg-background/50 backdrop-blur-sm rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">معلومات الاتصال</h2>
                    <p className="text-muted-foreground mb-4">تحديث بيانات التواصل</p>
                    <Button asChild>
                        <Link href="/admin/contact">
                            <Phone className="ml-2 h-4 w-4" />
                            إدارة جهات الاتصال
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}