import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDb } from '@/lib/db';
import type { InValue } from '@libsql/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  await ensureDb();

  const clientResult = await db.execute({
    sql: 'SELECT * FROM clients WHERE share_token = ?',
    args: [params.token],
  });
  const client = clientResult.rows[0];

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let query = `SELECT * FROM instagram_posts WHERE client_id = ?`;
  const queryParams: InValue[] = [client.id as InValue];

  if (from) {
    query += ' AND posted_at >= ?';
    queryParams.push(from);
  }
  if (to) {
    query += ' AND posted_at <= ?';
    queryParams.push(to);
  }

  query += ' ORDER BY posted_at DESC LIMIT 100';

  const result = await db.execute({ sql: query, args: queryParams });

  return NextResponse.json(result.rows);
}
