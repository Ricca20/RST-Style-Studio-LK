import { getTranslations } from 'next-intl/server';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: 'Navigation' });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-900 py-32 text-center text-white relative">
        <div className="absolute inset-0 bg-blue-600/10 z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-black mb-6">{tNav('contact')}</h1>
          <p className="text-xl text-gray-300">Have a question or want to work together? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
            <p className="text-gray-600 text-lg">
              Whether you need music production, a video shoot, or a branding package, RST Studio is fully equipped to handle your creative needs. Drop us a line!
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Call Us</h4>
                  <p className="text-xl font-medium text-gray-900">+94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Email Us</h4>
                  <p className="text-xl font-medium text-gray-900">hello@rststylestudiolk.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Visit Us</h4>
                  <p className="text-xl font-medium text-gray-900 max-w-xs">123 Studio Road, Colombo, Sri Lanka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea rows="5" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
  
