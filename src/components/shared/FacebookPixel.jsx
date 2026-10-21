'use client';

import Script from 'next/script';

/**
 * Meta (Facebook) Pixel component.
 * Loads only when a Pixel ID is configured in StudioSettings. The layout validates
 * the ID as numeric before passing it, since it is interpolated into the script.
 */
export default function FacebookPixel({ pixelId }) {
  if (!pixelId) return null;

  return (
    <Script id="facebook-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
