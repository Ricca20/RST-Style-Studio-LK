import { Bricolage_Grotesque, Plus_Jakarta_Sans, Noto_Sans_Sinhala, Caveat } from 'next/font/google';
import './globals.css';

// Display face for headlines: a characterful grotesque with optical sizes
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-noto-sinhala',
  display: 'swap',
});

// Handwritten signature accents
const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-handwritten',
  display: 'swap',
  weight: ['500', '700'],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rststylestudio.lk'),
  title: 'RST Style Studio LK',
  description: 'Premium music production studio in Sri Lanka',
};

export default function RootLayout({ children }) {
  return (
    <html className="dark" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${plusJakarta.variable} ${notoSinhala.variable} ${caveat.variable} font-sans antialiased bg-paper text-ink overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
