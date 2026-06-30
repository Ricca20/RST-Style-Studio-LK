import prisma from '@/lib/db';
import { Shield, Clock, User, Activity, AlertCircle } from 'lucide-react';
import { requireRole } from '@/lib/auth/server-auth';
import { redirect } from 'next/navigation';

import AdminSearchFilter from '@/components/admin/AdminSearchFilter';
import AdminPagination from '@/components/admin/AdminPagination';

export default async function AuditLogsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const page = parseInt(params?.page || '1');
  const pageSize = 15;

  // Only SUPER_ADMIN and ADMIN can view audit logs
  const { authorized, user } = await requireRole(['SUPER_ADMIN', 'ADMIN']);
  if (!authorized) {
    redirect('/admin');
  }

  const where = {};
  if (search) {
    where.OR = [
      { action: { contains: search, mode: 'insensitive' } },
      { entity: { contains: search, mode: 'insensitive' } },
      { user: { email: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: { email: true, name: true, role: true }
        }
      }
    }),
    prisma.auditLog.count({ where })
  ]);

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            System Audit Logs
          </h1>
          <p className="text-gray-500 mt-2">Track who is making changes inside your studio dashboard.</p>
        </div>
      </div>

      <AdminSearchFilter 
        placeholder="Search logs by action, entity, or email..." 
      />

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-sm text-gray-500">
                <th className="py-4 px-6 font-medium">Timestamp</th>
                <th className="py-4 px-6 font-medium">User</th>
                <th className="py-4 px-6 font-medium">Action</th>
                <th className="py-4 px-6 font-medium">Entity</th>
                <th className="py-4 px-6 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                      <p>No audit logs recorded yet.</p>
                    </div>
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {log.user ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {log.user.name ? log.user.name[0] : log.user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.user.email}</p>
                          <p className="text-xs text-gray-500">{log.user.role}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">System / Deleted User</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border">
                      <Activity className="w-3.5 h-3.5" />
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-medium">
                    {log.entity}
                    {log.entityId && <span className="text-gray-400 text-xs ml-2 font-mono">ID: {log.entityId.slice(0, 8)}...</span>}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                    {log.ipAddress || 'Unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminPagination totalCount={totalCount} pageSize={pageSize} currentPage={page} />
      </div>
    </div>
  );
}
