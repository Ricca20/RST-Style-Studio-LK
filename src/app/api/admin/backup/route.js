import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireRole } from '@/lib/auth/server-auth';
import * as XLSX from 'xlsx';

const formatDate = (date) => (date ? new Date(date).toISOString() : '');

// Each export type maps to a sheet name and a loader that returns plain rows.
const EXPORTS = {
  songs: ['Songs', async () => {
    const songs = await prisma.song.findMany({ orderBy: { createdAt: 'desc' }, include: { contributions: true } });
    return songs.map((s) => ({
      TitleEN: s.titleEn,
      TitleSI: s.titleSi,
      Slug: s.slug,
      Type: s.projectType,
      Status: s.isDraft ? 'Draft' : 'Published',
      Featured: s.isFeatured ? 'Yes' : 'No',
      Genres: s.genres.join(', '),
      ReleaseYear: s.releaseYear ?? '',
      YouTube: s.youtubeUrl || '',
      Spotify: s.spotifyUrl || '',
      Facebook: s.facebookUrl || '',
      Credits: s.contributions.map((c) => `${c.role}: ${c.name}`).join('; '),
      CreatedAt: formatDate(s.createdAt),
      DeletedAt: formatDate(s.deletedAt),
    }));
  }],
  profiles: ['Profiles', async () => {
    const profiles = await prisma.profile.findMany({ orderBy: { sortOrder: 'asc' } });
    return profiles.map((p) => ({
      Name: p.name,
      Slug: p.slug,
      MainRole: p.mainRole || '',
      Bio: p.bio || '',
      Active: p.isActive ? 'Yes' : 'No',
      Approved: p.isApproved ? 'Yes' : 'No',
      ImageUrl: p.imageUrl || '',
      CreatedAt: formatDate(p.createdAt),
      DeletedAt: formatDate(p.deletedAt),
    }));
  }],
  services: ['Services', async () => {
    const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } });
    return services.map((s) => ({
      NameEN: s.nameEn,
      NameSI: s.nameSi,
      NameIT: s.nameIt || '',
      BasePrice: s.basePrice ?? '',
      Active: s.isActive ? 'Yes' : 'No',
      DeletedAt: formatDate(s.deletedAt),
    }));
  }],
  quotations: ['Quotations', async () => {
    const quotations = await prisma.quotationRequest.findMany({ orderBy: { createdAt: 'desc' } });
    return quotations.map((q) => ({
      CreatedAt: formatDate(q.createdAt),
      Status: q.status,
      Name: q.name,
      Phone: q.phone,
      Email: q.email || '',
      Genre: q.genre || '',
      EstimatedBudget: q.estimatedBudget,
      Team: (Array.isArray(q.selections) ? q.selections : []).map((s) => `${s.roleLabel || s.role}: ${s.name}`).join('; '),
      Description: q.description || '',
      AdminNotes: q.adminNotes || '',
      DeletedAt: formatDate(q.deletedAt),
    }));
  }],
  auditlogs: ['AuditLogs', async () => {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, include: { user: true } });
    return logs.map((l) => ({
      Timestamp: formatDate(l.createdAt),
      User: l.user ? l.user.email : 'System',
      Action: l.action,
      Entity: l.entity,
      EntityId: l.entityId || '',
      IP: l.ipAddress || '',
    }));
  }],
};

export async function GET(request) {
  try {
    const auth = await requireRole(['SUPER_ADMIN']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';
    const type = searchParams.get('type') || 'all';

    const types = type === 'all' ? Object.keys(EXPORTS) : [type];
    if (types.some((t) => !EXPORTS[t])) {
      return NextResponse.json({ error: `Invalid type. Use all, ${Object.keys(EXPORTS).join(', ')}` }, { status: 400 });
    }

    const sheets = [];
    for (const t of types) {
      const [name, load] = EXPORTS[t];
      sheets.push([name, XLSX.utils.json_to_sheet(await load())]);
    }

    let body;
    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      for (const [name, sheet] of sheets) XLSX.utils.book_append_sheet(workbook, sheet, name);
      body = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    } else {
      // CSV holds a single table, so a multi-type export is written as one
      // section per type, each headed by its name.
      body = sheets
        .map(([name, sheet]) => (sheets.length > 1 ? `# ${name}\n` : '') + XLSX.utils.sheet_to_csv(sheet))
        .join('\n\n');
    }

    const contentType = format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="rst_studio_backup_${type}_${new Date().toISOString().split('T')[0]}.${format}"`
      }
    });
  } catch (error) {
    console.error('Backup Error:', error);
    return NextResponse.json({ error: 'Failed to generate backup' }, { status: 500 });
  }
}
