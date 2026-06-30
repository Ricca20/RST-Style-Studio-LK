import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, logAuditAction } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    const user = await checkAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [deletedSongs, deletedProfiles, deletedServices] = await Promise.all([
      prisma.song.findMany({ where: { deletedAt: { not: null } }, select: { id: true, titleEn: true, deletedAt: true } }),
      prisma.profile.findMany({ where: { deletedAt: { not: null } }, select: { id: true, name: true, deletedAt: true } }),
      prisma.service.findMany({ where: { deletedAt: { not: null } }, select: { id: true, nameEn: true, deletedAt: true } })
    ]);

    const trashItems = [
      ...deletedSongs.map(s => ({ id: s.id, name: s.titleEn, type: 'SONG', deletedAt: s.deletedAt })),
      ...deletedProfiles.map(p => ({ id: p.id, name: p.name, type: 'PROFILE', deletedAt: p.deletedAt })),
      ...deletedServices.map(s => ({ id: s.id, name: s.nameEn, type: 'SERVICE', deletedAt: s.deletedAt }))
    ].sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

    return NextResponse.json(trashItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trash items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await checkAuth();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, type, id } = body; // action: 'RESTORE' or 'DELETE_PERMANENT'

    if (!['RESTORE', 'DELETE_PERMANENT'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    let result;
    const modelMap = {
      SONG: prisma.song,
      PROFILE: prisma.profile,
      SERVICE: prisma.service
    };

    const model = modelMap[type];
    if (!model) return NextResponse.json({ error: 'Invalid type' }, { status: 400 });

    if (action === 'RESTORE') {
      result = await model.update({ where: { id }, data: { deletedAt: null } });
      await logAuditAction(user.dbUser.id, `RESTORE_${type}`, type, id, { restored: true }, request);
    } else if (action === 'DELETE_PERMANENT') {
      result = await model.delete({ where: { id } });
      await logAuditAction(user.dbUser.id, `PERMANENT_DELETE_${type}`, type, id, { deleted: true }, request);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing trash action:', error);
    return NextResponse.json({ error: 'Failed to process action' }, { status: 500 });
  }
}
