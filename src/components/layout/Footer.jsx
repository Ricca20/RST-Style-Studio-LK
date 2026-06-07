'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  return (
    <footer className="bg-[#0a080c] border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.PNG"
                alt="RST Style Studio"
                className="h-8 w-8 rounded-full object-cover"
              />
              <h4 className="text-xl font-bold text-white">RST Style Studio</h4>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {tFooter('description')}
            </p>
            <div className="flex gap-3">
              {/* Social icons */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#9d2bee] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#9d2bee] hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692 1.197 0 1.968.125 2.154.167v2.219z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-[#9d2bee] hover:text-white transition-all"
                aria-label="YouTube"
              >
                <span className="material-symbols-outlined text-lg">play_circle</span>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-white font-bold mb-4">Studio</h5>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/about" className="text-white/60 hover:text-[#9d2bee] text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/songs" className="text-white/60 hover:text-[#9d2bee] text-sm transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/contributors" className="text-white/60 hover:text-[#9d2bee] text-sm transition-colors">
                    {tNav('contributors')}
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-white/30 hover:text-[#9d2bee] text-xs transition-colors mt-2 block">
                    {tNav('login')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-4">{tNav('services')}</h5>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/services" className="text-white/60 hover:text-[#9d2bee] text-sm transition-colors">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link href="/quote" className="text-white/60 hover:text-[#9d2bee] text-sm transition-colors">
                    {tNav('getQuote')}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h5 className="text-white font-bold mb-4">{tNav('contact')}</h5>
              <ul className="flex flex-col gap-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">email</span>
                  hello@rststylestudiolk.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">phone</span>
                  +94 77 123 4567
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">place</span>
                  Sri Lanka
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} RST Style Studio LK. {tFooter('rights')}.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/30 hover:text-white text-xs transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
