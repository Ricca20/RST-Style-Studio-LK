import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth/server-auth';
import { broadcastNotification } from '@/lib/services/notification';

export async function POST(request) {
  try {
    const auth = await requireRole(['SUPER_ADMIN']);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await request.json();
    const { title, message, type, targetRoles } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    const validTypes = ['QUOTATION', 'SYSTEM', 'TEAM'];
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER'];
    const roles = Array.isArray(targetRoles) ? targetRoles.filter((r) => validRoles.includes(r)) : [];

    const result = await broadcastNotification(
      roles.length > 0 ? roles : validRoles,
      { title, message, type: validTypes.includes(type) ? type : 'SYSTEM' }
    );
    if (!result) {
      return NextResponse.json({ error: 'No team members to notify' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
