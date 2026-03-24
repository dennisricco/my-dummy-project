import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WA Clone AI — Chat',
  description: 'A high-fidelity WhatsApp Web clone with AI assistant, built with Next.js 16.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="h-screen overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
