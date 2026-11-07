import type { Metadata } from 'next';
import { Manrope, Outfit } from 'next/font/google';
import { BRAND } from '@compras-ja/shared';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: BRAND.presentationName,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.slogan,
  applicationName: BRAND.name,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: BRAND.name,
    title: BRAND.presentationName,
    description: BRAND.slogan,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${outfit.variable} ${manrope.variable} font-sans`}>{children}</body>
    </html>
  );
}
