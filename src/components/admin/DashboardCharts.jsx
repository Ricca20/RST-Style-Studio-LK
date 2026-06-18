'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, Filter } from 'lucide-react';

export default function DashboardCharts({ quotesData, genreData, currentDays = 30, conversionRate = 0, funnelData = { total: 0, pending: 0, accepted: 0 } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#64748b'];

  const handleDaysChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('days', e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Filters */}
      <div className="flex justify-end">
        <div className="flex items-center gap-2 bg-white border px-3 py-1.5 rounded-lg shadow-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <select 
            value={currentDays} 
            onChange={handleDaysChange}
            className="text-sm font-medium text-gray-700 outline-none bg-transparent cursor-pointer"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart for Quotations */}
        <div className="bg-white rounded-2xl border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quotation Requests (Last {currentDays} Days)</h3>
        <div className="h-72 w-full">
          {quotesData && quotesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quotesData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="count" stroke="#111827" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Not enough data yet.</div>
          )}
        </div>
      </div>

      {/* Pie Chart for Genres */}
      <div className="bg-white rounded-2xl border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Popular Genres Requested</h3>
        <div className="h-72 w-full">
          {genreData && genreData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {genreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Not enough data yet.</div>
          )}
        </div>
      </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold text-lg">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3>Quotation Conversion Funnel</h3>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 max-w-4xl mx-auto py-4">
          {/* Total Step */}
          <div className="flex flex-col items-center flex-1 w-full relative">
            <div className="bg-blue-50 w-full rounded-t-xl py-6 border-b-4 border-blue-500 text-center shadow-sm">
              <span className="block text-3xl font-bold text-blue-900">{funnelData.total}</span>
              <span className="block text-sm font-medium text-blue-700 uppercase tracking-wider mt-1">Total Requests</span>
            </div>
          </div>
          
          <div className="hidden md:block w-8 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* Pending Step */}
          <div className="flex flex-col items-center flex-1 w-full relative transform md:scale-95">
            <div className="bg-amber-50 w-full rounded-t-xl py-6 border-b-4 border-amber-500 text-center shadow-sm">
              <span className="block text-3xl font-bold text-amber-900">{funnelData.pending}</span>
              <span className="block text-sm font-medium text-amber-700 uppercase tracking-wider mt-1">Pending Review</span>
            </div>
            <div className="text-xs text-gray-500 font-medium mt-3 bg-gray-100 px-3 py-1 rounded-full">
              {funnelData.total > 0 ? Math.round((funnelData.pending / funnelData.total) * 100) : 0}% of Total
            </div>
          </div>

          <div className="hidden md:block w-8 text-gray-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* Accepted Step */}
          <div className="flex flex-col items-center flex-1 w-full relative transform md:scale-90">
            <div className="bg-emerald-50 w-full rounded-t-xl py-6 border-b-4 border-emerald-500 text-center shadow-sm">
              <span className="block text-3xl font-bold text-emerald-900">{funnelData.accepted}</span>
              <span className="block text-sm font-medium text-emerald-700 uppercase tracking-wider mt-1">Accepted</span>
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-3 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
              {conversionRate}% Conversion Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
