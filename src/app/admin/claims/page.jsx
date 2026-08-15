'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      // In a real app we would have an API for this or pass it from a server component
      const res = await fetch('/api/admin/claims');
      if (res.ok) {
        const data = await res.json();
        setClaims(data);
      }
    } catch (err) {
      toast.error('Failed to load claims');
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/claims/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Claim ${status.toLowerCase()} successfully`);
        fetchClaims();
      } else {
        toast.error('Failed to update claim');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading claims...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Song Claims Review</h1>
        <p className="text-gray-500 mt-2">Review claims from artists who want to be credited on your songs.</p>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        {claims.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No pending claims.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b text-sm text-gray-500">
                <tr>
                  <th className="py-4 px-6 font-medium">Artist (User)</th>
                  <th className="py-4 px-6 font-medium">Song</th>
                  <th className="py-4 px-6 font-medium">Claimed Role</th>
                  <th className="py-4 px-6 font-medium">Proof / Note</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                  <th className="py-4 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900">{claim.user?.name || claim.user?.email || claim.userId}</td>
                    <td className="py-4 px-6 font-medium text-gray-800">{claim.song?.titleEn || claim.song?.titleSi || '-'}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border">
                        {claim.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{claim.proof || '-'}</td>
                    <td className="py-4 px-6">
                      {claim.status === 'PENDING' && <span className="text-yellow-700 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-md text-xs font-medium">PENDING</span>}
                      {claim.status === 'APPROVED' && <span className="text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md text-xs font-medium">APPROVED</span>}
                      {claim.status === 'REJECTED' && <span className="text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md text-xs font-medium">REJECTED</span>}
                    </td>
                    <td className="py-4 px-6 flex gap-2">
                      {claim.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(claim.id, 'APPROVED')}
                            className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(claim.id, 'REJECTED')}
                            className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
