import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminProjects() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
        <Link href="/admin/projects/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Project
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.length > 0 ? projects.map(proj => (
                <tr key={proj.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{proj.titleEn}</td>
                  <td className="p-4 text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{proj.type}</span>
                  </td>
                  <td className="p-4 text-gray-600">{proj.clientName || '-'}</td>
                  <td className="p-4 flex justify-end space-x-3 items-center">
                    <button className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
