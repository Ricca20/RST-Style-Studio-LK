'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, ExternalLink, Users, TrendingUp, Filter, Loader2, MessageSquare, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminClientsCRM() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch('/api/admin/clients');
        if (!res.ok) throw new Error('Failed to fetch CRM data');
        const data = await res.json();
        setClients(data);
      } catch (error) {
        toast.error('Error loading client data');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
    (c.phone && c.phone.includes(search))
  );

  const totalLTV = clients.reduce((acc, curr) => acc + curr.lifetimeValue, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Client CRM</h1>
          <p className="text-gray-500 mt-1">Manage relationships and track lifetime value.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Total Clients</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
        </div>
        <div className="bg-white rounded-2xl border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="font-medium">Total Lifetime Value</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">Rs {totalLTV.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <MessageSquare className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium">Average Projects / Client</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {clients.length > 0 ? (clients.reduce((acc, c) => acc + c.totalProjects, 0) / clients.length).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search clients by name, email, or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Export Contacts
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-sm uppercase tracking-wider border-b">
                <th className="p-4 font-semibold w-1/3">Client Info</th>
                <th className="p-4 font-semibold text-center">Projects (Acc/Tot)</th>
                <th className="p-4 font-semibold text-right">Lifetime Value</th>
                <th className="p-4 font-semibold text-right">Last Contact</th>
                <th className="p-4 font-semibold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Loading clients...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">No clients found matching your search.</td>
                </tr>
              ) : filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/50 transition group bg-white">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{client.name}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-0.5 text-xs text-gray-500">
                          {client.email && <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3" /> {client.email}</span>}
                          {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                      <span className={client.acceptedProjects > 0 ? "text-emerald-600 font-bold" : ""}>{client.acceptedProjects}</span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span>{client.totalProjects}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className={`font-bold ${client.lifetimeValue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                      Rs {client.lifetimeValue.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-gray-600">
                    {new Date(client.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {client.email && (
                        <a href={`mailto:${client.email}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Send Email">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {client.phone && (
                        <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="WhatsApp">
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
