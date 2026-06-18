import prisma from '@/lib/db';

/**
 * Send a notification to a specific user.
 */
export async function createNotification(userId, { title, message, type, link }) {
  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

/**
 * Broadcast a notification to all users matching certain roles.
 * e.g., roles = ['SUPER_ADMIN', 'ADMIN']
 */
export async function broadcastNotification(roles, { title, message, type, link }) {
  try {
    const targetUsers = await prisma.user.findMany({
      where: {
        role: { in: roles }
      },
      select: { id: true }
    });

    if (targetUsers.length === 0) return null;

    const data = targetUsers.map(user => ({
      userId: user.id,
      title,
      message,
      type,
      link,
    }));

    return await prisma.notification.createMany({
      data,
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    return null;
  }
}
