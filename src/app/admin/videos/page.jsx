import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';

export default async function AdminVideos() {
  const videos = await prisma.song.findMany({ 
    where: { projectType: 'MUSIC_VIDEO' },
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Music Videos</h1>
        <Link href="/admin/videos/new" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Video
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Title (EN)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Genre</th>
                <th className="p-4 font-semibold">Year</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {videos.length > 0 ? videos.map(video => (
                <tr key={video.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{video.titleEn}</td>
                  <td className="p-4">
                    {video.isDraft ? <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">DRAFT</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">PUBLISHED</span>}
                  </td>
                  <td className="p-4 text-gray-600">{video.genres && video.genres.length > 0 ? video.genres.join(', ') : '-'}</td>
                  <td className="p-4 text-gray-600">{video.releaseYear || '-'}</td>
                  <td className="p-4">
                    {video.isFeatured ? <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">YES</span> : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">NO</span>}
                  </td>
                  <td className="p-4 flex justify-end space-x-3">
                    <Link href={`/admin/videos/${video.id}/edit`} className="text-gray-400 hover:text-blue-600 transition"><Edit className="w-5 h-5" /></Link>
                    <DeleteButton id={video.id} title={video.titleEn} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No music videos found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
