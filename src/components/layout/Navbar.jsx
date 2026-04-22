'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/songs', label: t('songs') },
    { href: '/projects', label: t('projects') },
    { href: '/contributors', label: t('contributors') },
    { href: '/services', label: t('services') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600 tracking-tight">
              RST Studio
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <LocaleSwitcher />
            <Link href="/quote" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
              {t('getQuote')}
            </Link>
          </div>

          <div className="flex items-center md:hidden gap-4">
            <LocaleSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-white absolute w-full z-40">
          <div className="px-2 pt-2 pb-5 space-y-1 sm:px-3 shadow-lg bg-white border-b">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link 
              href="/quote" 
              className="block px-3 py-2 mt-4 mx-2 rounded-md text-base font-medium bg-blue-600 text-white text-center shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              {t('getQuote')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
  
