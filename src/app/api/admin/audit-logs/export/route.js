import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const auth = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true, role: true } }
      }
    });

    const csvLines = [
      ['ID', 'Timestamp', 'User Email', 'User Role', 'Action', 'Entity', 'Entity ID', 'IP Address', 'Details'].join(',')
    ];

    for (const log of logs) {
      const details = log.details ? JSON.stringify(log.details).replace(/"/g, '""') : '';
      const email = log.user ? log.user.email : 'System/Deleted User';
      const role = log.user ? log.user.role : '';
      csvLines.push([
        log.id,
        new Date(log.createdAt).toISOString(),
        email,
        role,
        log.action,
        log.entity,
        log.entityId || '',
        log.ipAddress || '',
        `"${details}"`
      ].join(','));
    }

    const csvContent = csvLines.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit_logs_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Error exporting audit logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
