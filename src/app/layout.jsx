import { Outfit, Plus_Jakarta_Sans, Noto_Sans_Sinhala, Caveat } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-noto-sinhala',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'RST Style Studio LK',
  description: 'Premium music production studio in Sri Lanka',
};

export default function RootLayout({ children }) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${plusJakarta.variable} ${notoSinhala.variable} ${caveat.variable} font-[family-name:var(--font-sans)] antialiased bg-[#0f172a] text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
