'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <label className="relative">
      <span className="sr-only">Change language</span>
      <select
        defaultValue={locale}
        onChange={onSelectChange}
        disabled={isPending}
        className={`appearance-none bg-transparent py-1 pl-2 pr-6 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPending ? 'opacity-50 cursor-wait' : ''}`}
      >
        <option value="si">සිංහල</option>
        <option value="en">English</option>
        <option value="it">Italiano</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </label>
  );
}
  
