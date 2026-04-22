import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function AdminQuotations() {
  const quotes = await prisma.quotationRequest.findMany({ orderBy: { createdAt: 'desc' } });

  async function updateStatus(formData) {
    'use server';
    const id = formData.get('id');
    const status = formData.get('status');
    await prisma.quotationRequest.update({ where: { id }, data: { status } });
    revalidatePath('/admin/quotations');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Quotation Requests</h1>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Client</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold">Service Req</th>
                <th className="p-4 font-semibold">Budget</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {quotes.length > 0 ? quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{quote.name}</td>
                  <td className="p-4 text-gray-600 text-sm">{quote.phone}<br/>{quote.email}</td>
                  <td className="p-4 text-gray-600 text-sm">
                    {quote.serviceType}
                    <div className="text-xs text-gray-400 mt-1">
                      {quote.needsMelody && 'Melody | '}
                      {quote.needsInstruments && 'Inst | '}
                      {quote.needsMusicVideo && 'Video'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-900 font-bold">Rs {quote.estimatedBudget.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block text-center min-w-[100px] ${
                      quote.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      quote.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                      quote.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <form action={updateStatus} className="inline-flex items-center gap-2">
                      <input type="hidden" name="id" value={quote.id} />
                      <select name="status" defaultValue={quote.status} className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                      <button type="submit" className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition font-medium">Update</button>
                    </form>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No quotation requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
  
