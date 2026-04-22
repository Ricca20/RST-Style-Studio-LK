import prisma from '@/lib/db';
import { Music, Users, FileVideo, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [songCount, contribCount, projCount, quoteCount] = await Promise.all([
    prisma.song.count(),
    prisma.contributor.count(),
    prisma.project.count(),
    prisma.quotationRequest.count()
  ]);

  const recentQuotes = await prisma.quotationRequest.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  });

  const statCards = [
    { title: 'Total Songs', value: songCount, icon: Music, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Contributors', value: contribCount, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Projects', value: projCount, icon: FileVideo, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Quotations', value: quoteCount, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-xl shadow-sm border p-6 flex items-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} mr-4`}>
                <Icon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Quotation Requests</h2>
          <Link href="/admin/quotations" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentQuotes.length > 0 ? recentQuotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{quote.name}</td>
                  <td className="p-4 text-gray-600">{quote.serviceType}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      quote.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                      quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{new Date(quote.createdAt).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">No quotation requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
