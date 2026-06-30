import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/auth/server-auth';

// Cleanup older read notifications automatically on fetch (older than 30 days)
async function cleanupOldNotifications() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: thirtyDaysAgo }
      }
    });
  } catch (err) {
    console.error('Error cleaning up notifications:', err);
  }
}

// GET all notifications for the current user
export async function GET(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fire & Forget Cleanup
    cleanupOldNotifications();

    const notifications = await prisma.notification.findMany({
      where: { userId: userContext.dbUser.id },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 most recent
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: userContext.dbUser.id, isRead: false }
    });

    return NextResponse.json({ data: notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH to mark specific or all notifications as read
export async function PATCH(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, markAll } = body;

    if (markAll) {
      await prisma.notification.updateMany({
        where: { userId: userContext.dbUser.id, isRead: false },
        data: { isRead: true }
      });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    await prisma.notification.update({
      where: { id, userId: userContext.dbUser.id },
      data: { isRead: true }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking notification read:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE to clear all notifications for the user
export async function DELETE(request) {
  try {
    const userContext = await checkAuth();
    if (!userContext || !userContext.dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.notification.deleteMany({
      where: { userId: userContext.dbUser.id }
    });

    return NextResponse.json({ success: true, message: 'Notifications cleared' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
