import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import SortableServicesTable from '@/components/admin/SortableServicesTable';

export default async function AdminServices() {
  // Sort by sortOrder ascending
  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
        <Link href="/admin/services/new" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm">
          <Plus className="w-5 h-5 mr-2" /> Add Service
        </Link>
      </div>

      <SortableServicesTable initialServices={services} />
    </div>
  );
}
