import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';
import { ADMIN_ROLES } from '@/lib/auth/admin-access';
import { testimonialSchema } from '@/lib/testimonials';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const auth = await requireRole(ADMIN_ROLES);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const data = testimonialSchema.parse(await request.json());
    const testimonial = await prisma.testimonial.update({ where: { id }, data });
    await logAuditAction(auth.user.dbUser.id, 'UPDATE_TESTIMONIAL', 'Testimonial', id, { name: data.name }, request);
    return NextResponse.json(testimonial);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const auth = await requireRole(ADMIN_ROLES);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    await prisma.testimonial.delete({ where: { id } });
    await logAuditAction(auth.user.dbUser.id, 'DELETE_TESTIMONIAL', 'Testimonial', id, null, request);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
