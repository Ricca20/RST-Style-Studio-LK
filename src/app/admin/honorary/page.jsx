import prisma from '@/lib/db';

export default async function AdminHonorary() {
  const mentions = await prisma.honoraryMention.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Honorary Mentions</h1>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-8 text-center text-gray-500">
        Future integration planned for Honorable Awards records.
      </div>
    </div>
  );
}
  
