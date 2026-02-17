'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { updateContactInfo } from '@/app/actions/contact';
import {
    Loader2,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Save
} from 'lucide-react';

interface ContactData {
    id?: number;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
}

interface ContactManagementProps {
    initialData: ContactData | null;
}

export default function ContactManagement({ initialData }: ContactManagementProps) {
    const [data, setData] = useState<ContactData>(initialData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const newData = {
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            facebook: formData.get('facebook') as string,
            instagram: formData.get('instagram') as string,
            twitter: formData.get('twitter') as string,
        };

        try {
            const result = await updateContactInfo(newData);
            setData(result);
            toast.success('تم تحديث معلومات الاتصال بنجاح', {
                style: { background: 'linear-gradient(to right, #4f46e5, #db2777)', color: 'white' }
            });
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'حدث خطأ', {
                style: { background: '#ef4444', color: 'white' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto border-0 bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-sm shadow-xl dark:from-gray-900/80 dark:to-indigo-950/80">
            <CardHeader className="border-b border-indigo-100 dark:border-indigo-900">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                    <Save className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    بيانات التواصل
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* الهاتف */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Phone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            رقم الهاتف
                        </label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={data.phone || ''}
                            placeholder="+966 50 123 4567"
                            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 dark:border-indigo-800 dark:focus:border-indigo-400"
                        />
                    </div>

                    {/* البريد الإلكتروني */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            البريد الإلكتروني
                        </label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={data.email || ''}
                            placeholder="info@example.com"
                            className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 dark:border-pink-800 dark:focus:border-pink-400"
                        />
                    </div>

                    {/* العنوان */}
                    <div className="space-y-2">
                        <label htmlFor="address" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            العنوان
                        </label>
                        <Textarea
                            id="address"
                            name="address"
                            defaultValue={data.address || ''}
                            placeholder="الرياض، المملكة العربية السعودية"
                            rows={2}
                            className="border-purple-200 focus:border-purple-500 focus:ring-purple-500 dark:border-purple-800 dark:focus:border-purple-400"
                        />
                    </div>

                    {/* فيسبوك */}
                    <div className="space-y-2">
                        <label htmlFor="facebook" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Facebook className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            رابط فيسبوك
                        </label>
                        <Input
                            id="facebook"
                            name="facebook"
                            defaultValue={data.facebook || ''}
                            placeholder="https://facebook.com/..."
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-800 dark:focus:border-blue-400"
                        />
                    </div>

                    {/* إنستغرام */}
                    <div className="space-y-2">
                        <label htmlFor="instagram" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Instagram className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            رابط إنستغرام
                        </label>
                        <Input
                            id="instagram"
                            name="instagram"
                            defaultValue={data.instagram || ''}
                            placeholder="https://instagram.com/..."
                            className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 dark:border-pink-800 dark:focus:border-pink-400"
                        />
                    </div>

                    {/* تويتر */}
                    <div className="space-y-2">
                        <label htmlFor="twitter" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <Twitter className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            رابط تويتر
                        </label>
                        <Input
                            id="twitter"
                            name="twitter"
                            defaultValue={data.twitter || ''}
                            placeholder="https://twitter.com/..."
                            className="border-sky-200 focus:border-sky-500 focus:ring-sky-500 dark:border-sky-800 dark:focus:border-sky-400"
                        />
                    </div>

                    {/* زر الحفظ */}
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:from-indigo-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            'حفظ التغييرات'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}