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

  if (loading) return <div className="p-8 text-white/50">Loading claims...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-2">Song Claims Review</h1>
      <p className="text-white/60 mb-8">Review claims from artists who want to be credited on your songs.</p>

      <div className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden">
        {claims.length === 0 ? (
          <div className="p-8 text-center text-white/50">No pending claims.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-black/20 text-white/50 text-sm">
              <tr>
                <th className="p-4">Artist (User)</th>
                <th className="p-4">Song</th>
                <th className="p-4">Claimed Role</th>
                <th className="p-4">Proof / Note</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{claim.user?.name || claim.userId}</td>
                  <td className="p-4">{claim.song?.titleEn}</td>
                  <td className="p-4">{claim.role}</td>
                  <td className="p-4 text-white/50 text-sm">{claim.proof || '-'}</td>
                  <td className="p-4">
                    {claim.status === 'PENDING' && <span className="text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded text-xs">PENDING</span>}
                    {claim.status === 'APPROVED' && <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded text-xs">APPROVED</span>}
                    {claim.status === 'REJECTED' && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs">REJECTED</span>}
                  </td>
                  <td className="p-4 flex gap-2">
                    {claim.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(claim.id, 'APPROVED')}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(claim.id, 'REJECTED')}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-sm transition-colors"
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
        )}
      </div>
    </div>
  );
}
