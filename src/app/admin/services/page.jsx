import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function AdminServices() {
  const services = await prisma.service.findMany({ orderBy: { basePrice: 'asc' } });

  async function toggleActive(formData) {
    'use server';
    const id = formData.get('id');
    const isActive = formData.get('isActive') === 'true';
    await prisma.service.update({ where: { id }, data: { isActive: !isActive } });
    revalidatePath('/admin/services');
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm opacity-50 cursor-not-allowed">
          <Plus className="w-5 h-5 mr-2" /> Add Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Service Name (EN)</th>
                <th className="p-4 font-semibold">Key/ID</th>
                <th className="p-4 font-semibold">Base Price</th>
                <th className="p-4 font-semibold">Visible?</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.length > 0 ? services.map(svc => (
                <tr key={svc.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{svc.icon}</span>
                      {svc.nameEn}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-mono text-sm">{svc.itemKey}</td>
                  <td className="p-4 font-bold text-gray-900">Rs {svc.basePrice?.toLocaleString() || '0'}</td>
                  <td className="p-4">
                    <form action={toggleActive}>
                      <input type="hidden" name="id" value={svc.id} />
                      <input type="hidden" name="isActive" value={svc.isActive.toString()} />
                      <button type="submit" className={`px-2 py-1 rounded text-xs font-bold ${svc.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {svc.isActive ? 'ACTIVE' : 'HIDDEN'}
                      </button>
                    </form>
                  </td>
                  <td className="p-4 flex justify-end space-x-3 items-center">
                    <button className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No services found. Run DB Seed script.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
