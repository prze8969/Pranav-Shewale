import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['400', '500', '600', '700'], display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', weight: ['500', '600', '700'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Pranav Shewale · Blockchain & full-stack engineer',
  description: 'Portfolio of Pranav Shewale, mapped onto the Mandelbrot set: smart contracts, RWA tokenization, Solana, Hyperledger Fabric and full-stack work. Computer Engineering at VESIT Mumbai and BS Data Science at IIT Madras.',
  keywords: ['Pranav Shewale', 'Blockchain Engineer', 'Solidity', 'Foundry', 'Hyperledger Fabric', 'Solana', 'Anchor', 'RWA tokenization', 'Next.js', 'VESIT', 'IIT Madras'],
  authors: [{ name: 'Pranav Shewale', url: 'https://github.com/prze8969' }],
  openGraph: {
    title: 'Pranav Shewale · Blockchain & full-stack engineer',
    description: 'A portfolio you explore by zooming into the Mandelbrot set.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07080C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}>
      <body className="bg-[#07080C] text-[#F1F3F7] antialiased">{children}</body>
    </html>
  );
}
