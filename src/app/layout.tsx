/**
 * Root layout with premium typography
 */

import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Interactive Wall Calendar | Premium Edition',
  description:
    'A stunning, glassmorphic interactive wall calendar with seasonal themes, smart notes, and beautiful animations.',
  keywords: [
    'calendar',
    'interactive',
    'wall calendar',
    'glassmorphism',
    'premium',
    'next.js',
    'react',
  ],
  openGraph: {
    title: 'Interactive Wall Calendar | Premium Edition',
    description:
      'A stunning glassmorphic wall calendar with seasonal themes and smart notes',
    type: 'website',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📅</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
