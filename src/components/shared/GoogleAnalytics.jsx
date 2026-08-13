'use client';

import Script from 'next/script';

/**
 * Google Analytics 4 component.
 * Conditionally loads the GA4 script only when a valid tracking ID is provided.
 * The ID is fetched from StudioSettings and passed down from the layout.
 */
export default function GoogleAnalytics({ gaId }) {
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
