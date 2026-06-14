import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { Save, Globe, Shield, Paintbrush, Activity, Share2, Briefcase, Layout, Music } from 'lucide-react';
import FormImageUpload from '@/components/admin/FormImageUpload';
import RevokeSessionsButton from '@/components/admin/RevokeSessionsButton';
import { checkAuth, logAuditAction } from '@/lib/server-auth';

export default async function AdminSettings() {
  let settings = await prisma.studioSettings.findFirst();
  if (!settings) {
    settings = await prisma.studioSettings.create({
      data: { name: 'RST Style Studio LK', email: 'hello@rststylestudiolk.com' }
    });
  }

  async function updateSettings(formData) {
    'use server';
    const userContext = await checkAuth();

    const data = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      whatsapp: formData.get('whatsapp') || '',
      address: formData.get('address') || '',
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      defaultCurrency: formData.get('defaultCurrency') || 'LKR',
      
      bookingStatus: formData.get('bookingStatus') || 'AVAILABLE',
      minimumQuotationBudget: parseFloat(formData.get('minimumQuotationBudget')) || 0,
      taxRate: parseFloat(formData.get('taxRate')) || 0,
      footerText: formData.get('footerText') || '',

      enableMultiLanguage: formData.get('enableMultiLanguage') === 'on',
      enableLiveChat: formData.get('enableLiveChat') === 'on',
      displayClientReviews: formData.get('displayClientReviews') === 'on',
      autoPlayMusic: formData.get('autoPlayMusic') === 'on',

      facebookUrl: formData.get('facebookUrl') || '',
      youtubeUrl: formData.get('youtubeUrl') || '',
      spotifyUrl: formData.get('spotifyUrl') || '',
      instagramUrl: formData.get('instagramUrl') || '',
      tiktokUrl: formData.get('tiktokUrl') || '',
      xUrl: formData.get('xUrl') || '',

      metaTitle: formData.get('metaTitle') || '',
      metaDescription: formData.get('metaDescription') || '',
      ogImageUrl: formData.get('ogImageUrl') || '',

      googleAnalyticsId: formData.get('googleAnalyticsId') || '',
      facebookPixelId: formData.get('facebookPixelId') || '',

      accentColor: formData.get('accentColor') || '#9d2bee',
      enableAnimations: formData.get('enableAnimations') === 'on',

      adminAlertEmail: formData.get('adminAlertEmail') || '',
      whatsappApiToken: formData.get('whatsappApiToken') || '',
      aiPromptContext: formData.get('aiPromptContext') || '',
    };

    await prisma.studioSettings.updateMany({ data });

    if (userContext?.dbUser?.id) {
      const headersList = await headers();
      const ip = headersList.get('x-forwarded-for') || null;
      await logAuditAction(userContext.dbUser.id, 'UPDATE_SETTINGS', 'Settings', settings.id, { status: 'Success' }, { ip });
    }

    revalidatePath('/admin/settings');
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Studio Settings</h1>
        <p className="text-gray-500 mt-2">Manage all website configurations, aesthetics, SEO, and integrations.</p>
      </div>
      
      <form action={updateSettings} className="space-y-8">
        
        {/* General & Business Identity */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">General & Identity</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Studio Name</label>
              <input type="text" name="name" defaultValue={settings.name} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input type="email" name="email" defaultValue={settings.email} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input type="text" name="phone" defaultValue={settings.phone} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
              <input type="text" name="whatsapp" defaultValue={settings.whatsapp} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Physical Address</label>
              <input type="text" name="address" defaultValue={settings.address} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="font-bold text-red-800 text-sm">Maintenance Mode</p>
                <p className="text-sm text-red-600">Turn this on to hide the public website from visitors.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenanceMode" defaultChecked={settings.maintenanceMode} className="sr-only peer" />
                <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div className="md:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-bold text-gray-800 text-sm">Multi-Language Support</p>
                <p className="text-sm text-gray-500">Show the language switcher on the public site (EN/SI/IT)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="enableMultiLanguage" defaultChecked={settings.enableMultiLanguage} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Custom Footer Copyright Text</label>
              <input type="text" name="footerText" defaultValue={settings.footerText} placeholder="e.g. © 2026 RST Style Studio LK. All rights reserved." className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </section>

        {/* Business & Booking */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-900">Business & Booking</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Studio Booking Status</label>
              <select name="bookingStatus" defaultValue={settings.bookingStatus} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="AVAILABLE">Accepting New Projects</option>
                <option value="BUSY">Heavy Workload (Slower Response)</option>
                <option value="AWAY">Fully Booked / On Vacation</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
              <select name="defaultCurrency" defaultValue={settings.defaultCurrency} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                <option value="LKR">LKR (Sri Lankan Rupee)</option>
                <option value="USD">USD (US Dollar)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Quotation Budget</label>
              <input type="number" step="0.01" name="minimumQuotationBudget" defaultValue={settings.minimumQuotationBudget} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Rate (%)</label>
              <input type="number" step="0.01" name="taxRate" defaultValue={settings.taxRate} className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </section>

        {/* Theme & Aesthetics */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Paintbrush className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Theme & Aesthetics</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Accent Color (Hex)</label>
              <div className="flex gap-3">
                <input type="color" name="accentColor" defaultValue={settings.accentColor} className="h-10 w-14 p-1 border rounded cursor-pointer" />
                <input type="text" defaultValue={settings.accentColor} className="flex-1 border rounded-lg px-4 outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm" disabled />
              </div>
              <p className="text-xs text-gray-500 mt-2">Changes the glowing effects and buttons across the site.</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-bold text-gray-800 text-sm">Micro-Animations</p>
                <p className="text-sm text-gray-500">Enable heavy glassmorphic hover effects</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="enableAnimations" defaultChecked={settings.enableAnimations} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
              <div>
                <p className="font-bold text-gray-800 text-sm">Client Reviews</p>
                <p className="text-sm text-gray-500">Show testimonials section on website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="displayClientReviews" defaultChecked={settings.displayClientReviews} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </section>

        {/* SEO & Sharing */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Share2 className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">SEO & Sharing</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Global Meta Title</label>
              <input type="text" name="metaTitle" defaultValue={settings.metaTitle} placeholder="e.g. RST Style Studio | Premier Audio Production" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Global Meta Description</label>
              <textarea name="metaDescription" defaultValue={settings.metaDescription} rows="3" placeholder="A short description for Google search results..." className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 resize-y" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">OpenGraph (OG) Image URL</label>
              <FormImageUpload name="ogImageUrl" defaultValue={settings.ogImageUrl} label="Upload OG Image" />
              <p className="text-xs text-gray-500 mt-2">Upload a 1200x630 image. This image appears when you paste your website link in WhatsApp or Facebook.</p>
            </div>
          </div>
        </section>

        {/* Analytics & Marketing */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Activity className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Analytics & Tracking</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Analytics ID</label>
              <input type="text" name="googleAnalyticsId" defaultValue={settings.googleAnalyticsId} placeholder="e.g. G-XXXXXXX" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook Pixel ID</label>
              <input type="text" name="facebookPixelId" defaultValue={settings.facebookPixelId} placeholder="e.g. 1234567890" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 font-mono" />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Globe className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Social Media Links</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube URL</label><input type="text" name="youtubeUrl" defaultValue={settings.youtubeUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Spotify URL</label><input type="text" name="spotifyUrl" defaultValue={settings.spotifyUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook URL</label><input type="text" name="facebookUrl" defaultValue={settings.facebookUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram URL</label><input type="text" name="instagramUrl" defaultValue={settings.instagramUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">TikTok URL</label><input type="text" name="tiktokUrl" defaultValue={settings.tiktokUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">X (Twitter) URL</label><input type="text" name="xUrl" defaultValue={settings.xUrl} className="w-full border rounded-lg px-4 py-2 outline-none" /></div>
          </div>
        </section>

        {/* Advanced Integrations */}
        <section className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-gray-900">Advanced Integrations & Backup</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-3 p-5 bg-blue-50 border border-blue-100 rounded-xl">
              <div>
                <h3 className="font-bold text-blue-900 text-sm">Local Backup & Export</h3>
                <p className="text-sm text-blue-700">Download a full database backup of all entities (Songs, Quotations, Audit Logs, etc.).</p>
              </div>
              <div className="flex gap-3 mt-2">
                <a href="/api/admin/backup?format=csv&type=all" className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition shadow-sm text-center">
                  Download Full CSV Backup
                </a>
                <a href="/api/admin/backup?format=xlsx&type=all" className="bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition shadow-sm text-center">
                  Download Full Excel Backup
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-5 bg-rose-50 border border-rose-100 rounded-xl mt-6">
              <div>
                <h3 className="font-bold text-rose-900 text-sm">Security & Sessions</h3>
                <p className="text-sm text-rose-700">Manage active authenticated sessions and security features.</p>
              </div>
              <div className="flex gap-3 mt-2">
                <RevokeSessionsButton />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Alert Email</label>
                <input type="email" name="adminAlertEmail" defaultValue={settings.adminAlertEmail} placeholder="Where quotation alerts are sent" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp API Token</label>
                <input type="password" name="whatsappApiToken" defaultValue={settings.whatsappApiToken} placeholder="For automated client texts" className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-slate-500 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Live Chat Widget</p>
                  <p className="text-sm text-gray-500">Enable floating customer support chat</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="enableLiveChat" defaultChecked={settings.enableLiveChat} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                <div>
                  <p className="font-bold text-gray-800 text-sm">Auto-Play Trailer/Music</p>
                  <p className="text-sm text-gray-500">Play background media on homepage load</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="autoPlayMusic" defaultChecked={settings.autoPlayMusic} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Chatbot Custom Prompt (Optional Context)</label>
              <textarea name="aiPromptContext" defaultValue={settings.aiPromptContext} rows="4" placeholder="Instructions for the AI chatbot about your studio's services..." className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-slate-500 resize-y" />
            </div>
          </div>
        </section>

        {/* Save Bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white border-t flex justify-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition flex items-center gap-2">
            <Save className="w-5 h-5" /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
  
