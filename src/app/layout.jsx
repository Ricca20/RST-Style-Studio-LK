import { Inter, Noto_Sans_Sinhala } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoSinhala = Noto_Sans_Sinhala({ subsets: ['sinhala'], variable: '--font-noto-sinhala', display: 'swap' });

export const metadata = {
  title: 'RST Style Studio LK',
  description: 'Premium music production studio in Sri Lanka',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoSinhala.variable} font-sans antialiased text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
  
