import { TRPCProvider } from '@/lib/trpc/client';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Immobilien-Marktübersicht für Österreich',
  description:
    'Umfassender Überblick über aktuelle Immobilienpreise in Österreich. Vergleiche Kauf- und Mietpreise für Wohnungen in verschiedenen Regionen. Professionelle Marktanalyse für Käufer, Verkäufer und Investoren.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
    </TRPCProvider>
  );
}
