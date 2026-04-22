import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminContributors() {
  const contributors = await prisma.contributor.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Contributors</h1>
        <Link href="/admin/contributors/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Contributor
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold w-16">Image</th>
                <th className="p-4 font-semibold">Name (EN)</th>
                <th className="p-4 font-semibold">Name (SI)</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contributors.length > 0 ? contributors.map(person => (
                <tr key={person.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                      {person.image && <img src={person.image} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-gray-900">{person.nameEn}</td>
                  <td className="p-4 text-gray-600">{person.nameSi}</td>
                  <td className="p-4 flex justify-end space-x-3 items-center h-full pt-6 border-none">
                    <button className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No contributors found setup yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
