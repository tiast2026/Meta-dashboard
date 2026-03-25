import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDb } from '@/lib/db';
import { queryOne, table, DATASET_MASTER } from '@/lib/bq';

const T = table(DATASET_MASTER, 'clients');

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await ensureDb();

    const client = await queryOne<Record<string, unknown>>(
      `SELECT client_id FROM ${T} WHERE share_token = @token LIMIT 1`,
      { token: params.token }
    );

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const posts = await db.execute({
      sql: `SELECT * FROM instagram_tagged_posts
            WHERE client_id = ?
            ORDER BY posted_at DESC`,
      args: [String(client.client_id)],
    });

    return NextResponse.json({ posts: posts.rows });
  } catch (err) {
    console.error('Dashboard tagged posts error:', err);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}
