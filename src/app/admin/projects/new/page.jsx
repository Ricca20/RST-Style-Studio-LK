import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { createSlug } from '@/lib/slugify';

export default function NewProject() {
  async function createProject(formData) {
    'use server';
    const titleEn = formData.get('titleEn');
    const titleSi = formData.get('titleSi');
    const titleIt = formData.get('titleIt') || null;
    const type = formData.get('type') || 'OTHER';
    const clientName = formData.get('clientName') || null;
    const slug = createSlug(titleEn || titleSi);

    await prisma.project.create({
      data: { titleEn, titleSi, titleIt, slug, type, clientName }
    });

    redirect('/admin/projects');
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Project</h1>
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <form action={createProject} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (English) *</label>
              <input type="text" name="titleEn" required className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title (Sinhala) *</label>
              <input type="text" name="titleSi" required className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select name="type" required className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none bg-white focus:ring-2 focus:ring-blue-500">
                <option value="AUDIO">Audio</option>
                <option value="VIDEO">Video</option>
                <option value="BRANDING">Branding</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input type="text" name="clientName" className="w-full border-gray-300 border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="pt-6">
            <button type="submit" className="bg-gray-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition shadow-md">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
