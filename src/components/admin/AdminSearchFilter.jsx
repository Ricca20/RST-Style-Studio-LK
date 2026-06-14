'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminSearchFilter({ placeholder = "Search...", statusOptions = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'ALL';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Handle URL updates
  const updateUrl = (search, status) => {
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    if (status && status !== 'ALL') {
      params.set('status', status);
    } else {
      params.delete('status');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateUrl(searchTerm, currentStatus);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, currentStatus, pathname]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {statusOptions.length > 0 && (
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select 
            value={currentStatus}
            onChange={(e) => updateUrl(searchTerm, e.target.value)}
            className="w-full md:w-48 py-2.5 px-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white text-sm"
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
