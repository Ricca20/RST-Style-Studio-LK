import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import AdminSearchFilter from '@/components/admin/AdminSearchFilter';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminSongsTable from '@/components/admin/AdminSongsTable';

export default async function AdminSongs({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const status = params?.status || 'ALL';
  const page = parseInt(params?.page || '1');
  const pageSize = 15;

  const where = { 
    projectType: 'SONG',
    deletedAt: null 
  };
  
  if (search) {
    where.OR = [
      { titleEn: { contains: search, mode: 'insensitive' } },
      { titleSi: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (status === 'PUBLISHED') {
    where.isDraft = false;
  } else if (status === 'DRAFT') {
    where.isDraft = true;
  }

  const [songs, totalCount] = await Promise.all([
    prisma.song.findMany({ 
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.song.count({ where })
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Songs</h1>
        <Link href="/admin/songs/new" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Song
        </Link>
      </div>

      <AdminSearchFilter 
        placeholder="Search songs by title..." 
        statusOptions={[
          { value: 'PUBLISHED', label: 'Published' },
          { value: 'DRAFT', label: 'Drafts' }
        ]}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
        <AdminSongsTable songs={songs} />
        <AdminPagination totalCount={totalCount} pageSize={pageSize} currentPage={page} />
      </div>
    </div>
  );
}
  
