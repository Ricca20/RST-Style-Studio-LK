import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export default function NewContributor() {
  async function createContributor(formData) {
    'use server';
    const nameEn = formData.get('nameEn');
    const nameSi = formData.get('nameSi');
    const nameIt = formData.get('nameIt') || null;
    const bioEn = formData.get('bioEn') || null;
    const bioSi = formData.get('bioSi') || null;
    const bioIt = formData.get('bioIt') || null;

    await prisma.contributor.create({
      data: { nameEn, nameSi, nameIt, bioEn, bioSi, bioIt }
    });

    redirect('/admin/contributors');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Contributor</h1>
      
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form action={createContributor} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (English) *</label>
              <input type="text" name="nameEn" required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (Sinhala) *</label>
              <input type="text" name="nameSi" required className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography (English)</label>
              <textarea name="bioEn" rows="3" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biography (Sinhala)</label>
              <textarea name="bioSi" rows="3" className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>
          </div>
          <div className="pt-6">
            <button type="submit" className="bg-gray-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition shadow-md">
              Save Contributor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
