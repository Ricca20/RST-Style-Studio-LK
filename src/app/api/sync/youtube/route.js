import { NextResponse } from 'next/server';
import { isAuthorizedCronRequest, syncPlatform } from '@/lib/services/socialSync';

export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncPlatform('YOUTUBE');
  return NextResponse.json(result, { status: result.status === 'failed' ? 502 : 200 });
}
