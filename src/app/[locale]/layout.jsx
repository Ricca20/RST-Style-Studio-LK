import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalScene from '@/components/3d/GlobalScene';

export const metadata = {
  title: {
    template: '%s | RST Style Studio LK',
    default: 'RST Style Studio LK - Music Production & Portfolio',
  },
  description: 'Professional home music studio in Sri Lanka. View our portfolio of 100+ songs, profiles of our talented contributors, and request quotations for your music projects.',
  openGraph: {
    title: 'RST Style Studio LK',
    description: 'Professional home music studio in Sri Lanka. View our portfolio of 100+ songs, profiles of our talented contributors, and request quotations for your music projects.',
    url: 'https://rststylestudio.lk',
    siteName: 'RST Style Studio LK',
    images: [
      {
        url: '/images/og-default.jpg', // You can change this to a valid default image URL later
        width: 1200,
        height: 630,
        alt: 'RST Style Studio LK Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col text-white relative">
        
        {/* Global Video Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-[1.35]"
            poster="/logo.PNG"
          >
            <source src="/Herovideo.MP4" type="video/mp4" />
          </video>
          {/* Dark overlay to ensure content remains readable */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <GlobalScene />
        <Navbar />
        <main className="flex-1 relative z-20">{children}</main>
        <div className="relative z-20">
          <Footer />
        </div>
      </div>
    </NextIntlClientProvider>
  );
}
