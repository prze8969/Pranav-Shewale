import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { SoundProvider, SoundToggle } from '../components/SoundEffects';
import { AmbientSnow } from '../components/AmbientSnow';
import { CompassHUD } from '../components/CompassHUD';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pranav Shewale — Dovahkiin of the Byte Stream | Portfolio',
  description: 'Skyrim-themed portfolio of Pranav Shewale — Blockchain Engineer, Smart Contract Auditor (ERC-2535, Foundry, Slither), Computer Engineering Student (VESIT 10 CGPA / IIT Madras BS).',
  keywords: [
    'Pranav Shewale',
    'Blockchain Engineer',
    'Smart Contract Auditor',
    'Solidity',
    'Foundry',
    'Slither',
    'ERC-2535',
    'Polygon',
    'VESIT',
    'IIT Madras',
    'Skyrim Portfolio'
  ],
  authors: [{ name: 'Pranav Shewale', url: 'https://github.com/prze8969' }],
  openGraph: {
    title: 'Pranav Shewale — Arcane Auditor & Systems Architect',
    description: 'Portfolio dossier: Smart contract auditing, RWA tokenization on Polygon, digital twins, and systems engineering.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="bg-[#080b11] text-[#e4ecf5] antialiased relative min-h-screen">
        <SoundProvider>
          <AmbientSnow />
          <CompassHUD />
          <main className="relative z-10">{children}</main>
          <SoundToggle />
        </SoundProvider>
      </body>
    </html>
  );
}
