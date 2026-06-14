import { listMediaFiles } from '@/lib/media-actions';
import { requireRole } from '@/lib/server-auth';
import { redirect } from 'next/navigation';
import { Image as ImageIcon, Video, File, Trash2, Link as LinkIcon, DownloadCloud } from 'lucide-react';
import MediaListClient from './MediaListClient';
import AdminSearchFilter from '@/components/admin/AdminSearchFilter';

export default async function AdminMediaPage() {
  const { authorized } = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!authorized) {
    redirect('/admin');
  }

  const files = await listMediaFiles();

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-blue-600" />
            Central Media Library
          </h1>
          <p className="text-gray-500 mt-2">Manage all images and files uploaded to your Supabase storage.</p>
        </div>
      </div>

      <AdminSearchFilter 
        placeholder="Search files by name..." 
      />

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <DownloadCloud className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No media files found</h3>
            <p className="text-gray-500 mt-1">Upload images via the Songs or Profiles tabs.</p>
          </div>
        ) : (
          <MediaListClient initialFiles={files} />
        )}
      </div>
    </div>
  );
}
