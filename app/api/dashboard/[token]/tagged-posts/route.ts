import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDb } from '@/lib/db';

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

  const result = await db.execute({
    sql: `SELECT * FROM instagram_tagged_posts
    WHERE client_id = ?
    ORDER BY posted_at DESC`,
    args: [client.id],
  });

  return NextResponse.json(result.rows);
}
