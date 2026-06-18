'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, User, Check, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTeamSettingsPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/admin/team');
        if (!res.ok) throw new Error('Failed to fetch team data');
        const data = await res.json();
        setTeam(data);
      } catch (error) {
        toast.error('Error loading team or you do not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');

      setTeam(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const ROLES = [
    { value: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full access including role changes' },
    { value: 'ADMIN', label: 'Admin', desc: 'Can manage content and view financials' },
    { value: 'EDITOR', label: 'Editor', desc: 'Can only edit songs, profiles, and media' },
    { value: 'VIEWER', label: 'Viewer', desc: 'Read-only access to dashboard' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Roles</h1>
        <p className="text-gray-500 mt-1">Manage who has access to your studio dashboard.</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4 items-start">
        <Shield className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900">How Team Access Works</h3>
          <p className="text-sm text-blue-800 mt-1">
            New users who sign in are automatically granted the <strong>ADMIN</strong> role by default. If you want to restrict someone, you must change their role here. Only <strong>SUPER_ADMIN</strong> users can change roles.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            Loading team members...
          </div>
        ) : team.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No team members found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition bg-white">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{member.name || 'Unnamed User'}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        disabled={updatingId === member.id}
                        className={`appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-sm font-semibold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${
                          member.role === 'SUPER_ADMIN' ? 'text-purple-700 bg-purple-50 border-purple-200' :
                          member.role === 'ADMIN' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                          'text-gray-700'
                        }`}
                      >
                        {ROLES.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      {updatingId === member.id && (
                        <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
                      )}
                    </div>
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
