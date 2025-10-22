import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Documentação desativada' }, { status: 403 });
  }
  const spec = await getApiDocs();
  return NextResponse.json(spec);
}
