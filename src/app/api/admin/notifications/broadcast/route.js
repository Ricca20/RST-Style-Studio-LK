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

    await broadcastNotification(
      title,
      message,
      type || 'SYSTEM',
      targetRoles || ['ADMIN', 'EDITOR', 'VIEWER']
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
