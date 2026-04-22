import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default async function AdminSongs() {
  const songs = await prisma.song.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Songs</h1>
        <Link href="/admin/songs/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Song
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Title (EN)</th>
                <th className="p-4 font-semibold">Genre</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {songs.length > 0 ? songs.map(song => (
                <tr key={song.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{song.titleEn}</td>
                  <td className="p-4 text-gray-600">{song.genre || '-'}</td>
                  <td className="p-4 text-gray-600">{song.releaseYear || '-'}</td>
                  <td className="p-4">
                    {song.isFeatured ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">YES</span> : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">NO</span>}
                  </td>
                  <td className="p-4 flex justify-end space-x-3">
                    <button className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></button>
                    <button className="text-gray-400 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No songs found in database.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
