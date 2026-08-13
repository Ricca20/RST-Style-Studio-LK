'use client';

import { useEffect } from 'react';

/**
 * Sets the <html> element's lang attribute dynamically based on the active locale.
 * This is needed because the root layout.jsx doesn't have access to the locale param,
 * so it defaults to "en". This component corrects it at mount time.
 */
export default function HtmlLangSetter({ locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
