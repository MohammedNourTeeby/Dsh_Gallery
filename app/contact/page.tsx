// app/contact/page.tsx
import { getContactInfo } from '@/app/actions/contact';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default async function ContactPage() {
    const contact = await getContactInfo();

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-transparent to-pink-50/30 dark:from-indigo-950/20 dark:via-transparent dark:to-pink-950/20">
            <div className="container mx-auto px-4 py-12 md:py-16">
                {/* رأس الصفحة المتحرك */}
                <div className="relative mb-12 text-center">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />

                    <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 p-3 shadow-lg">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>

                    <h1 className="mb-2 text-4xl font-bold md:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                            تواصل معنا
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        نحن هنا للإجابة على استفساراتك، تواصل معنا عبر أي من الوسائل التالية
                    </p>
                </div>

                {!contact ? (
                    <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/50 p-16 text-center backdrop-blur-sm dark:border-indigo-800 dark:bg-gray-900/50">
                        <MessageCircle className="mx-auto h-16 w-16 text-indigo-300 dark:text-indigo-700" />
                        <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            لا توجد معلومات اتصال حالياً
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            سنقوم بإضافة معلومات التواصل قريباً
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            العودة للرئيسية
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* بطاقة معلومات الاتصال */}
                        <Card className="group border-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/20 dark:from-gray-900/50 dark:to-gray-800/30">
                            <CardContent className="p-6 space-y-6">
                                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                                    معلومات الاتصال
                                </h2>

                                {contact.phone && (
                                    <div className="flex items-start gap-4 animate-fade-in-up">
                                        <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">الهاتف</h3>
                                            <p className="text-muted-foreground" dir="ltr">{contact.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {contact.email && (
                                    <div className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                        <div className="rounded-full bg-gradient-to-br from-pink-500 to-pink-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">البريد الإلكتروني</h3>
                                            <p className="text-muted-foreground">{contact.email}</p>
                                        </div>
                                    </div>
                                )}

                                {contact.address && (
                                    <div className="flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                        <div className="rounded-full bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">العنوان</h3>
                                            <p className="text-muted-foreground">{contact.address}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* بطاقة روابط التواصل الاجتماعي */}
                        {(contact.facebook || contact.instagram || contact.twitter) && (
                            <Card className="group border-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/20 dark:from-gray-900/50 dark:to-gray-800/30">
                                <CardContent className="p-6">
                                    <h2 className="mb-6 text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                                        تابعنا على
                                    </h2>
                                    <div className="space-y-4">
                                        {contact.facebook && (
                                            <a
                                                href={contact.facebook}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 hover:shadow-lg"
                                            >
                                                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                                    <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">فيسبوك</span>
                                            </a>
                                        )}

                                        {contact.instagram && (
                                            <a
                                                href={contact.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-pink-600/10 hover:shadow-lg"
                                            >
                                                <div className="rounded-full bg-pink-100 p-2 dark:bg-pink-900/30">
                                                    <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">إنستغرام</span>
                                            </a>
                                        )}

                                        {contact.twitter && (
                                            <a
                                                href={contact.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-sky-500/10 hover:to-sky-600/10 hover:shadow-lg"
                                            >
                                                <div className="rounded-full bg-sky-100 p-2 dark:bg-sky-900/30">
                                                    <Twitter className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300">تويتر</span>
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* خريطة الموقع أو معلومات إضافية (اختياري) */}
                {contact && (
                    <div className="mt-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            يمكنك أيضاً التواصل عبر البريد الإلكتروني أو زيارة مقرنا
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}