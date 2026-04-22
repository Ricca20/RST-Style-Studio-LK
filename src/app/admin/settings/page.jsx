import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function AdminSettings() {
  let settings = await prisma.studioSettings.findFirst();
  if (!settings) {
    settings = await prisma.studioSettings.create({
      data: { studioName: 'RST Style Studio LK', contactEmail: 'hello@rststylestudiolk.com' }
    });
  }

  async function updateSettings(formData) {
    'use server';
    const studioName = formData.get('studioName');
    const contactEmail = formData.get('contactEmail');
    const contactPhone = formData.get('contactPhone');
    await prisma.studioSettings.updateMany({
      data: { studioName, contactEmail, contactPhone }
    });
    revalidatePath('/admin/settings');
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Studio Settings</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form action={updateSettings} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Studio Name</label>
            <input type="text" name="studioName" defaultValue={settings.studioName} className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input type="email" name="contactEmail" defaultValue={settings.contactEmail} className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp / Contact Phone</label>
            <input type="text" name="contactPhone" defaultValue={settings.contactPhone || ''} className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="pt-6 border-t border-gray-100">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition shadow-md">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
