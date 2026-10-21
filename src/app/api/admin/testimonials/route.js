import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { logAuditAction, requireRole } from '@/lib/auth/server-auth';
import { ADMIN_ROLES } from '@/lib/auth/admin-access';
import { testimonialSchema } from '@/lib/testimonials';

export async function GET() {
  const auth = await requireRole(ADMIN_ROLES);
  if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const testimonials = await prisma.testimonial.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
  return NextResponse.json(testimonials);
}

export async function POST(request) {
  try {
    const auth = await requireRole(ADMIN_ROLES);
    if (!auth.authorized) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const data = testimonialSchema.parse(await request.json());
    const testimonial = await prisma.testimonial.create({ data });
    await logAuditAction(auth.user.dbUser.id, 'CREATE_TESTIMONIAL', 'Testimonial', testimonial.id, { name: data.name }, request);
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Validation Error', details: error.issues }, { status: 400 });
    }
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
