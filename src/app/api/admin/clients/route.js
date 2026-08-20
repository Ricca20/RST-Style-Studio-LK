import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { checkAuth, requireRole } from '@/lib/auth/server-auth';

export async function GET(request) {
  try {
    const authResult = await requireRole(['SUPER_ADMIN', 'ADMIN']);
    if (!authResult.authorized) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const userContext = authResult.user;

    // Fetch all non-deleted quotations
    const quotations = await prisma.quotationRequest.findMany({
      where: { deletedAt: null },
      select: {
        name: true,
        email: true,
        phone: true,
        status: true,
        estimatedBudget: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Aggregate by email or phone (using email if exists, fallback to phone)
    const clientMap = new Map();

    quotations.forEach(quote => {
      const key = quote.email ? quote.email.toLowerCase().trim() : quote.phone.replace(/[^0-9+]/g, '');
      if (!key) return;

      if (!clientMap.has(key)) {
        clientMap.set(key, {
          id: key,
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          firstContact: quote.createdAt,
          lastContact: quote.createdAt,
          totalProjects: 0,
          acceptedProjects: 0,
          lifetimeValue: 0,
          quotes: []
        });
      }

      const client = clientMap.get(key);
      
      // Update stats
      client.totalProjects += 1;
      if (quote.status === 'ACCEPTED') {
        client.acceptedProjects += 1;
        client.lifetimeValue += quote.estimatedBudget || 0;
      }
      
      // Update dates
      if (new Date(quote.createdAt) < new Date(client.firstContact)) {
        client.firstContact = quote.createdAt;
      }
      if (new Date(quote.createdAt) > new Date(client.lastContact)) {
        client.lastContact = quote.createdAt;
      }

      // We only store recent quote history to keep payload light
      if (client.quotes.length < 5) {
        client.quotes.push({
          status: quote.status,
          budget: quote.estimatedBudget,
          date: quote.createdAt
        });
      }
    });

    const clientsArray = Array.from(clientMap.values());
    
    // Sort by lifetime value desc, then by most recent contact
    clientsArray.sort((a, b) => {
      if (b.lifetimeValue !== a.lifetimeValue) {
        return b.lifetimeValue - a.lifetimeValue;
      }
      return new Date(b.lastContact) - new Date(a.lastContact);
    });

    return NextResponse.json(clientsArray);
  } catch (error) {
    console.error('Error fetching CRM clients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
