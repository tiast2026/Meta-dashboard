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

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'from and to query params are required' }, { status: 400 });
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const periodLength = toDate.getTime() - fromDate.getTime();
  const prevTo = new Date(fromDate.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - periodLength);
  const prevFromStr = prevFrom.toISOString().split('T')[0];
  const prevToStr = prevTo.toISOString().split('T')[0];

  const dailyResult = await db.execute({
    sql: `SELECT * FROM instagram_daily_insights
     WHERE client_id = ? AND date >= ? AND date <= ?
     ORDER BY date ASC`,
    args: [client.id, from, to],
  });

  const kpiResult = await db.execute({
    sql: `SELECT
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(interactions), 0) as interactions,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments), 0) as comments,
      COALESCE(SUM(saves), 0) as saves,
      COALESCE(SUM(shares), 0) as shares,
      COALESCE(SUM(follows), 0) as follows,
      COALESCE(SUM(posts_count), 0) as posts_count
    FROM instagram_daily_insights
    WHERE client_id = ? AND date >= ? AND date <= ?`,
    args: [client.id, from, to],
  });

  const latestFollowersResult = await db.execute({
    sql: `SELECT followers FROM instagram_daily_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    ORDER BY date DESC LIMIT 1`,
    args: [client.id, from, to],
  });

  const kpi = {
    ...kpiResult.rows[0],
    followers: latestFollowersResult.rows[0]?.followers || 0,
  };

  const prevKpiResult = await db.execute({
    sql: `SELECT
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(interactions), 0) as interactions,
      COALESCE(SUM(likes), 0) as likes,
      COALESCE(SUM(comments), 0) as comments,
      COALESCE(SUM(saves), 0) as saves,
      COALESCE(SUM(shares), 0) as shares,
      COALESCE(SUM(follows), 0) as follows,
      COALESCE(SUM(posts_count), 0) as posts_count
    FROM instagram_daily_insights
    WHERE client_id = ? AND date >= ? AND date <= ?`,
    args: [client.id, prevFromStr, prevToStr],
  });

  const prevLatestFollowersResult = await db.execute({
    sql: `SELECT followers FROM instagram_daily_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    ORDER BY date DESC LIMIT 1`,
    args: [client.id, prevFromStr, prevToStr],
  });

  const previous_kpi = {
    ...prevKpiResult.rows[0],
    followers: prevLatestFollowersResult.rows[0]?.followers || 0,
  };

  return NextResponse.json({
    client: { name: client.name },
    daily: dailyResult.rows,
    kpi,
    previous_kpi,
  });
}
