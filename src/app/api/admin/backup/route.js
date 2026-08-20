import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, requireRole } from '@/lib/auth/server-auth';
import * as XLSX from 'xlsx';

export async function GET(request) {
  try {
    const user = await checkAuth();
    if (!user || user.dbUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const type = searchParams.get('type') || 'all'; // all, songs, profiles, services, quotations, auditlogs

    const workbook = XLSX.utils.book_new();

    if (type === 'all' || type === 'auditlogs') {
      const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } });
      const logsData = logs.map(l => ({
        Timestamp: new Date(l.createdAt).toLocaleString(),
        User: l.user ? l.user.email : 'System',
        Action: l.action,
        Entity: l.entity,
        IP: l.ipAddress
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(logsData), 'AuditLogs');
    }

    if (type === 'all' || type === 'songs') {
      const songs = await prisma.song.findMany({ orderBy: { createdAt: 'desc' } });
      const songsData = songs.map(s => ({
        TitleEN: s.titleEn,
        TitleSI: s.titleSi,
        Type: s.projectType,
        Status: s.isDraft ? 'Draft' : 'Published',
        ReleaseYear: s.releaseYear,
        IsDeleted: s.deletedAt ? 'Yes' : 'No'
      }));
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(songsData), 'Songs');
    }

    const buffer = format === 'csv' 
      ? XLSX.write(workbook, { type: 'buffer', bookType: 'csv' }) 
      : XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const extension = format === 'csv' ? 'csv' : 'xlsx';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="rst_studio_backup_${new Date().toISOString().split('T')[0]}.${extension}"`
      }
    });

  } catch (error) {
    console.error('Backup Error:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
