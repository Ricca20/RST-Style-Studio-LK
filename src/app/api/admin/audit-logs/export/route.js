import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/server-auth';
import prisma from '@/lib/db';

// Quotes every field (values like entity ids can contain commas) and neutralises
// leading = + - @ so spreadsheet apps don't evaluate a value as a formula.
function toCsvRow(values) {
  return values.map((value) => {
    let text = String(value ?? '');
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }).join(',');
}

export async function GET() {
  try {
    const auth = await requireRole(['SUPER_ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, name: true, role: true } }
      }
    });

    const csvLines = [
      toCsvRow(['ID', 'Timestamp', 'User Email', 'User Role', 'Action', 'Entity', 'Entity ID', 'IP Address', 'Details'])
    ];

    for (const log of logs) {
      csvLines.push(toCsvRow([
        log.id,
        new Date(log.createdAt).toISOString(),
        log.user ? log.user.email : 'System/Deleted User',
        log.user ? log.user.role : '',
        log.action,
        log.entity,
        log.entityId || '',
        log.ipAddress || '',
        log.details ? JSON.stringify(log.details) : ''
      ]));
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
