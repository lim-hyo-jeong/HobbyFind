import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { AuthProvider } from '@/components/auth/auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HobbyFind - 새로운 취미를 발견하세요',
  description: '운동형, 지능형, 예술형 취미 중에서 당신에게 맞는 취미를 찾아보세요. 로그인하면 관심 있는 취미를 북마크하고 관리할 수 있습니다.',
  keywords: '취미, 취미 추천, 운동형 취미, 지능형 취미, 예술형 취미, 북마크',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers><AuthProvider>{children}</AuthProvider></Providers>
      </body>
    </html>
  );
}
