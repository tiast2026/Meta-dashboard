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
    sql: `SELECT
      date,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results,
      COALESCE(SUM(spend), 0) as spend
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    GROUP BY date
    ORDER BY date ASC`,
    args: [client.id, from, to],
  });

  const campaignsResult = await db.execute({
    sql: `SELECT
      campaign_name,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results,
      COALESCE(SUM(spend), 0) as spend
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    GROUP BY campaign_name`,
    args: [client.id, from, to],
  });

  const campaigns = campaignsResult.rows.map((c) => ({
    ...c,
    cpc: (c.clicks as number) > 0 ? (c.spend as number) / (c.clicks as number) : 0,
    ctr: (c.impressions as number) > 0 ? ((c.clicks as number) / (c.impressions as number)) * 100 : 0,
  }));

  const adsetsResult = await db.execute({
    sql: `SELECT
      adset_name,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results,
      COALESCE(SUM(spend), 0) as spend
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    GROUP BY adset_name`,
    args: [client.id, from, to],
  });

  const platformsResult = await db.execute({
    sql: `SELECT
      publisher_platform,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results,
      COALESCE(SUM(spend), 0) as spend
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?
    GROUP BY publisher_platform`,
    args: [client.id, from, to],
  });

  const kpiRawResult = await db.execute({
    sql: `SELECT
      COALESCE(SUM(spend), 0) as spend,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?`,
    args: [client.id, from, to],
  });

  const kpiRaw = kpiRawResult.rows[0] as Record<string, number>;
  const kpi = {
    ...kpiRaw,
    cpc: kpiRaw.clicks > 0 ? kpiRaw.spend / kpiRaw.clicks : 0,
    ctr: kpiRaw.impressions > 0 ? (kpiRaw.clicks / kpiRaw.impressions) * 100 : 0,
  };

  const prevKpiRawResult = await db.execute({
    sql: `SELECT
      COALESCE(SUM(spend), 0) as spend,
      COALESCE(SUM(impressions), 0) as impressions,
      COALESCE(SUM(reach), 0) as reach,
      COALESCE(SUM(clicks), 0) as clicks,
      COALESCE(SUM(results), 0) as results
    FROM meta_ad_insights
    WHERE client_id = ? AND date >= ? AND date <= ?`,
    args: [client.id, prevFromStr, prevToStr],
  });

  const prevKpiRaw = prevKpiRawResult.rows[0] as Record<string, number>;
  const previous_kpi = {
    ...prevKpiRaw,
    cpc: prevKpiRaw.clicks > 0 ? prevKpiRaw.spend / prevKpiRaw.clicks : 0,
    ctr: prevKpiRaw.impressions > 0 ? (prevKpiRaw.clicks / prevKpiRaw.impressions) * 100 : 0,
  };

  return NextResponse.json({
    daily: dailyResult.rows,
    campaigns,
    adsets: adsetsResult.rows,
    platforms: platformsResult.rows,
    kpi,
    previous_kpi,
  });
}
