import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const report = await request.json();
    console.warn('CSP Violation:', JSON.stringify(report, null, 2));
    
    // In a production environment, you might want to save this to the database
    // or send it to an external monitoring service.
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process CSP report' }, { status: 500 });
  }
}
