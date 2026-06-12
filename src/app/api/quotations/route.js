import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth } from '@/lib/server-auth';

export async function GET(request) {
  try {
    const user = await checkAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quotations = await prisma.quotationRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(quotations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, description, genre, selections, attachments, estimatedBudget } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
    }

    const quotation = await prisma.quotationRequest.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        description: description?.trim() || null,
        genre: genre || null,
        selections: selections || [],
        attachments: attachments || [],
        estimatedBudget: parseFloat(estimatedBudget) || 0
      }
    });

    return NextResponse.json(quotation, { status: 201 });
  } catch (error) {
    console.error('Error creating quotation:', error);
    return NextResponse.json({ error: 'Failed to create quotation' }, { status: 500 });
  }
}
