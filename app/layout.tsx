import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'معمل الدقنيش',
  description: 'معرض فني يضم مجموعة مميزة من اللوحات والتماثيل والأعمال الفنية',
  icons: {
    icon: [
      { url: '/icon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'معمل الدقنيش',
    description: 'استعرض مجموعتنا الفنية المميزة',
    images: ['/dsh.jpg'],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Header />
        <main>{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
