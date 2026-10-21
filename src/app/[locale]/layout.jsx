import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/shared/GoogleAnalytics';
import FacebookPixel from '@/components/shared/FacebookPixel';
import HtmlLangSetter from '@/components/shared/HtmlLangSetter';
import MaintenanceGate from '@/components/shared/MaintenanceGate';
import WhatsAppChatButton from '@/components/shared/WhatsAppChatButton';
import { checkAuth } from '@/lib/auth/server-auth';
import { STAFF_ROLES } from '@/lib/auth/admin-access';
import {
  getPublicSettings,
  safeAccentColor,
  safeExternalUrl,
  safeFacebookPixelId,
  safeGoogleAnalyticsId,
} from '@/lib/settings';


const defaultMetadata = {
  metadataBase: new URL('https://rststylestudio.lk'),
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
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'RST Style Studio LK Cover Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    languages: {
      en: '/en',
      si: '/si',
      it: '/it',
    },
  },
};

// SEO fields from StudioSettings override the built-in defaults when set.
export async function generateMetadata() {
  const settings = await getPublicSettings();
  const title = settings?.metaTitle || null;
  const description = settings?.metaDescription || null;
  const ogImage = safeExternalUrl(settings?.ogImageUrl);

  return {
    ...defaultMetadata,
    ...(title && { title: { ...defaultMetadata.title, default: title } }),
    ...(description && { description }),
    openGraph: {
      ...defaultMetadata.openGraph,
      ...(title && { title }),
      ...(description && { description }),
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: title || defaultMetadata.openGraph.siteName }] }),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const settings = await getPublicSettings();
  const gaId = safeGoogleAnalyticsId(settings?.googleAnalyticsId);
  const pixelId = safeFacebookPixelId(settings?.facebookPixelId);
  const accentColor = safeAccentColor(settings?.accentColor);
  const enableAnimations = settings?.enableAnimations ?? true;
  const showLocaleSwitcher = settings?.enableMultiLanguage ?? true;

  const footerInfo = {
    name: settings?.name || null,
    email: settings?.email || null,
    phone: settings?.phone || null,
    address: settings?.address || null,
    footerText: settings?.footerText || null,
    socials: {
      instagram: safeExternalUrl(settings?.instagramUrl),
      facebook: safeExternalUrl(settings?.facebookUrl),
      youtube: safeExternalUrl(settings?.youtubeUrl),
      spotify: safeExternalUrl(settings?.spotifyUrl),
      tiktok: safeExternalUrl(settings?.tiktokUrl),
      x: safeExternalUrl(settings?.xUrl),
    },
  };

  // Staff can still browse the site while maintenance mode is on.
  let maintenanceActive = false;
  if (settings?.maintenanceMode) {
    const user = await checkAuth().catch(() => null);
    maintenanceActive = !STAFF_ROLES.includes(user?.dbUser?.role);
  }

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "RST Style Studio LK",
    "url": "https://rststylestudio.lk",
    "logo": "https://rststylestudio.lk/logo.png",
    "description": "Professional home music studio in Sri Lanka.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "LK"
    }
  };

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSetter locale={locale} />
      <GoogleAnalytics gaId={gaId} />
      <FacebookPixel pixelId={pixelId} />
      <div
        className={`flex min-h-screen flex-col bg-paper text-ink relative overflow-x-clip ${locale === 'si' ? 'font-[family-name:var(--font-noto-sinhala)]' : ''}`}
        style={accentColor ? { '--rst-accent': accentColor } : undefined}
        data-motion={enableAnimations ? 'on' : 'off'}
      >

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Navbar
          showLocaleSwitcher={showLocaleSwitcher}
          bookingStatus={settings?.bookingStatus}
          socials={footerInfo.socials}
          email={footerInfo.email}
        />
        <main className="flex-1 relative">
          <MaintenanceGate active={maintenanceActive} studioName={settings?.name}>
            {children}
          </MaintenanceGate>
        </main>
        <Footer info={footerInfo} />

        {settings?.enableLiveChat && !maintenanceActive && (
          <WhatsAppChatButton phone={settings.whatsapp || settings.phone} studioName={settings.name} />
        )}
      </div>
    </NextIntlClientProvider>
  );
}
