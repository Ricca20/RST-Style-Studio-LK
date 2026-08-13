import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalScene from '@/components/3d/GlobalScene';
import GoogleAnalytics from '@/components/shared/GoogleAnalytics';
import HtmlLangSetter from '@/components/shared/HtmlLangSetter';
import prisma from '@/lib/db';

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

  // Fetch Google Analytics ID from studio settings
  let gaId = null;
  try {
    const settings = await prisma.studioSettings.findFirst({
      select: { googleAnalyticsId: true },
    });
    gaId = settings?.googleAnalyticsId || null;
  } catch (e) {
    // Silently fail — GA is non-critical
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSetter locale={locale} />
      <GoogleAnalytics gaId={gaId} />
      <div className="flex min-h-screen flex-col text-white relative">
        
        {/* Global Sleek Aerospace Background & Ambient Glow */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#060913]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#0ea5e9]/10 via-[#9d2bee]/5 to-transparent rounded-full blur-[160px] opacity-70" />
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
