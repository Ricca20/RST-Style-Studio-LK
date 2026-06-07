import { Space_Grotesk, Noto_Sans, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const notoSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  variable: '--font-noto-sinhala',
  display: 'swap',
});

export const metadata = {
  title: 'RST Style Studio LK',
  description: 'Premium music production studio in Sri Lanka',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} ${notoSinhala.variable} font-[family-name:var(--font-display)] antialiased bg-[#151118] text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
