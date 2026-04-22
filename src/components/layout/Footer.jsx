import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const tNav = useTranslations('Navigation');
  const tFooter = useTranslations('Footer');

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-bold text-white tracking-tight">RST Style Studio LK</span>
            <p className="mt-4 text-sm text-gray-400 max-w-sm">
              {tFooter('description')}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition">{tNav('home')}</Link></li>
              <li><Link href="/songs" className="hover:text-blue-400 transition">{tNav('songs')}</Link></li>
              <li><Link href="/services" className="hover:text-blue-400 transition">{tNav('services')}</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition">{tNav('contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Admin</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/admin" className="hover:text-blue-400 transition">{tNav('login')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; {new Date().getFullYear()} RST Style Studio LK. {tFooter('rights')}.</p>
          <div className="mt-4 md:mt-0 opacity-50">Designed with Next.js & Tailwind</div>
        </div>
      </div>
    </footer>
  );
}
  
