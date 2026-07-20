import prisma from '@/lib/db';
import Link from 'next/link';
import { Plus, ExternalLink } from 'lucide-react';
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Services & Rack Rates</h1>
          <p className="text-sm text-gray-500 mt-1">Changes reflected instantly on the live /services page</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/services" target="_blank" className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm text-sm">
            <ExternalLink className="w-4 h-4 mr-2 text-gray-500" /> View Live Page
          </Link>
          <Link href="/admin/services/new" className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium flex items-center transition shadow-sm text-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Service
          </Link>
        </div>
      </div>

      <SortableServicesTable initialServices={services} />
    </div>
  );
}
