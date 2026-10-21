'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';

const LOCALES = [
  { code: 'si', label: 'සිං', name: 'සිංහල' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'it', label: 'IT', name: 'Italiano' },
];

/** Segmented language switch. `tone="paper"` for use on dark backgrounds. */
export default function LocaleSwitcher({ tone = 'ink' }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchTo = (code) => {
    if (code === locale) return;
    startTransition(() => router.replace(pathname, { locale: code }));
  };

  const base = tone === 'paper' ? 'border-paper/20' : 'border-ink/15';
  return (
    <div role="group" aria-label="Change language" className={`inline-flex rounded-full border p-1 ${base} ${isPending ? 'opacity-60' : ''}`}>
      {LOCALES.map(({ code, label, name }) => {
        const active = code === locale;
        const activeClass = tone === 'paper' ? 'bg-paper text-ink' : 'bg-ink text-paper';
        return (
          <button
            key={code}
            type="button"
            title={name}
            aria-pressed={active}
            disabled={isPending}
            onClick={() => switchTo(code)}
            className={`min-w-10 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${active ? activeClass : 'opacity-60 hover:opacity-100'}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
