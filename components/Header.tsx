'use client';

import Link from "next/link";
import {
    Menu, Search, User, Sparkles, Heart, Phone, Home, LogOut,
    ShoppingBag, Palette, Camera, ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const navigation = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "المنتجات", href: "/products", icon: Sparkles },
    { name: "اتصل بنا", href: "/contact", icon: Phone },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const pathname = usePathname();

    // التحقق من حالة تسجيل الدخول عبر API
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await fetch('/api/admin/check');
                const data = await res.json();
                setIsLoggedIn(data.loggedIn);
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    // تغيير خلفية الهيدر عند التمرير
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/admin/logout', { method: 'POST' });
            if (res.ok) {
                setIsLoggedIn(false);
                toast.success('تم تسجيل الخروج بنجاح', {
                    style: { background: 'linear-gradient(to right, #4f46e5, #db2777)', color: 'white' }
                });
                window.location.href = '/';
            } else {
                toast.error('حدث خطأ أثناء تسجيل الخروج');
            }
        } catch (error) {
            toast.error('حدث خطأ في الاتصال');
        }
    };

    // تحديد الرابط النشط
    const isActive = (href: string) => pathname === href;

    // إذا كانت الحالة لا تزال تحميل
    if (loading) {
        return (
            <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl border-b border-white/10">
                <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                        <span className="hidden sm:inline-block text-xl font-bold bg-gradient-to-r from-indigo-200 to-pink-200 bg-clip-text text-transparent">
                            DSH Gallery
                        </span>
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-500 ${scrolled
                ? "bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-xl border-b border-white/20 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                : "bg-transparent backdrop-blur-sm border-b border-transparent"
                }`}
        >
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* الشعار المطور */}
                <Link href="/" className="group flex items-center gap-2">
                    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]">
                        <span className="relative z-10 text-lg font-black text-white">DSh</span>
                        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    <span className="hidden text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent sm:inline-block">
                        معمل الدقنيش
                    </span>
                </Link>

                {/* الروابط الرئيسية - سطح المكتب */}
                <div className="hidden md:flex md:flex-1 md:justify-center">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.href);
                                return (
                                    <NavigationMenuItem key={item.name}>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={item.href}
                                                className={`group inline-flex h-10 w-max items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${active
                                                    ? "bg-gradient-to-r from-indigo-500/20 to-pink-500/20 text-indigo-200 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                                                    : "bg-background/50 text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-pink-500/10 hover:text-indigo-200 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                                                    }`}
                                            >
                                                <Icon className={`h-4 w-4 transition-all duration-300 ${active ? 'scale-110 text-indigo-300' : 'group-hover:scale-110 group-hover:text-indigo-300'
                                                    }`} />
                                                <span>{item.name}</span>
                                                {active && (
                                                    <span className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-400 to-pink-400" />
                                                )}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                );
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* منطقة البحث والمستخدم */}
                <div className="flex items-center gap-2">
                    {/* زر البحث للجوال */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden rounded-full bg-background/30 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20 hover:text-indigo-200 transition-all duration-300"
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* حقل البحث لسطح المكتب مع تأثيرات متطورة */}
                    <div className={`hidden md:flex md:w-40 lg:w-64 transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''
                        }`}>
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-all duration-300 group-focus-within:text-indigo-300" />
                            <Input
                                type="search"
                                placeholder="ابحث عن تحفتك..."
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="w-full rounded-full bg-background/30 pl-9 pr-4 backdrop-blur-sm border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:border-transparent transition-all duration-300"
                            />
                            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-indigo-500/0 to-pink-500/0 opacity-0 group-focus-within:opacity-100 group-focus-within:blur-xl transition-opacity duration-500" />
                        </div>
                    </div>

                    {/* قائمة المستخدم المتطورة */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative rounded-full p-0.5 group hover:scale-105 transition-all duration-300"
                            >
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 opacity-75 group-hover:opacity-100 group-hover:blur-md transition-all duration-500" />
                                <Avatar className="relative h-8 w-8 border-2 border-white/30 group-hover:border-white/50 transition-all duration-300">
                                    <AvatarImage src="/avatars/default.png" alt="user" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-pink-600 text-white">
                                        U
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-56 border-white/10 bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]"
                        >
                            <DropdownMenuLabel className="text-transparent bg-gradient-to-r from-indigo-200 to-pink-200 bg-clip-text font-bold">
                                حسابي
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem asChild className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20 focus:bg-gradient-to-r focus:from-indigo-500/20 focus:to-pink-500/20">
                                <Link href="/profile" className="flex items-center gap-2 text-gray-200 hover:text-white">
                                    <User className="h-4 w-4 text-indigo-300" />
                                    <span>الملف الشخصي</span>
                                </Link>
                            </DropdownMenuItem>

                            {/* روابط الإدارة - تظهر فقط للمدير */}
                            {isLoggedIn && (
                                <>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20">
                                        <Link href="/admin/products" className="flex items-center gap-2 text-gray-200 hover:text-white">
                                            <ShoppingBag className="h-4 w-4 text-pink-300" />
                                            <span>إدارة المنتجات</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20">
                                        <Link href="/admin/contact" className="flex items-center gap-2 text-gray-200 hover:text-white">
                                            <Phone className="h-4 w-4 text-purple-300" />
                                            <span>إدارة التواصل</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </>
                            )}

                            <DropdownMenuSeparator className="bg-white/10" />

                            {isLoggedIn ? (
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-200 hover:text-red-100 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-500/20 focus:bg-gradient-to-r focus:from-red-500/20 focus:to-red-500/20"
                                >
                                    <LogOut className="ml-2 h-4 w-4 text-red-300" />
                                    <span>تسجيل الخروج</span>
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem asChild className="cursor-pointer hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20">
                                    <Link href="/admin/login" className="flex items-center gap-2 text-gray-200 hover:text-white">
                                        <User className="h-4 w-4 text-indigo-300" />
                                        <span>تسجيل الدخول</span>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* القائمة الجانبية للجوال - محسنة */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden rounded-full bg-background/30 backdrop-blur-sm hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20 hover:text-indigo-200 transition-all duration-300"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[300px] border-l border-white/10 bg-gradient-to-b from-indigo-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-xl text-white sm:w-[400px]"
                        >
                            <SheetTitle className="sr-only">القائمة الرئيسية</SheetTitle>
                            <div className="mt-8 flex flex-col gap-6">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`group flex items-center gap-3 text-lg font-medium transition-all duration-300 hover:translate-x-2 ${active ? 'text-indigo-200' : 'text-gray-200'
                                                }`}
                                        >
                                            <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 transition-all duration-300 group-hover:scale-110 ${active ? 'from-indigo-500/40 to-pink-500/40' : ''
                                                }`}>
                                                <Icon className={`h-4 w-4 ${active ? 'text-indigo-300' : 'text-gray-300 group-hover:text-indigo-300'}`} />
                                            </span>
                                            <span className="relative">
                                                {item.name}
                                                {active && (
                                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-400" />
                                                )}
                                            </span>
                                        </Link>
                                    );
                                })}

                                {/* روابط الإدارة للجوال */}
                                {isLoggedIn && (
                                    <>
                                        <div className="border-t border-white/10 my-4" />
                                        <Link
                                            href="/admin/products"
                                            className="group flex items-center gap-3 text-lg font-medium text-gray-200 transition-all duration-300 hover:translate-x-2 hover:text-indigo-200"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 transition-all duration-300 group-hover:scale-110">
                                                <ShoppingBag className="h-4 w-4 text-indigo-300" />
                                            </span>
                                            إدارة المنتجات
                                        </Link>
                                        <Link
                                            href="/admin/contact"
                                            className="group flex items-center gap-3 text-lg font-medium text-gray-200 transition-all duration-300 hover:translate-x-2 hover:text-indigo-200"
                                        >
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 transition-all duration-300 group-hover:scale-110">
                                                <Phone className="h-4 w-4 text-purple-300" />
                                            </span>
                                            إدارة التواصل
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-white/10 my-4" />
                                {isLoggedIn ? (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 border-white/10 bg-background/30 text-red-200 hover:bg-red-500/20 hover:text-red-100 hover:border-red-500/30 transition-all duration-300"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        تسجيل الخروج
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 border-white/10 bg-background/30 text-gray-200 hover:bg-gradient-to-r hover:from-indigo-500/20 hover:to-pink-500/20 hover:text-white hover:border-indigo-500/30 transition-all duration-300"
                                        asChild
                                    >
                                        <Link href="/admin/login">
                                            <User className="h-4 w-4 text-indigo-300" />
                                            تسجيل الدخول
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* تأثير وهج خلفي ديناميكي */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600/0 via-purple-600/0 to-pink-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        </header>
    );
}